import { NextResponse } from 'next/server';
import { dataSource, NotConfiguredError } from '@/lib/data';
import { validateAddress } from '@/lib/utils';
import { buildProfile } from '@/lib/domain/survival';
import { computeAchievements } from '@/lib/domain/achievements';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { ERROR_MESSAGES } from '@/lib/domain/copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public, read-only wallet lookup. No authentication, no wallet connection. */
export async function GET(
  request: Request,
  context: { params: Promise<{ address: string }> },
) {
  const limit = rateLimit(`wallet:${clientKey(request)}`, 30, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Give the gravekeeper a moment.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.resetInSeconds) },
      },
    );
  }

  const { address: raw } = await context.params;
  const { valid, address } = validateAddress(raw);

  if (!valid || !address) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.invalidAddress },
      { status: 400 },
    );
  }

  try {
    const found = await dataSource.getWalletProfile(address);
    const profile =
      found ??
      (() => {
        // No recorded activity is a valid answer, not an error.
        const empty = buildProfile(address, [], {
          isDemo: dataSource.mode === 'demo',
        });
        empty.achievements = computeAchievements(empty);
        return empty;
      })();

    return NextResponse.json(
      { profile },
      {
        headers: {
          'Cache-Control': 'public, max-age=15, stale-while-revalidate=60',
          'X-RateLimit-Remaining': String(limit.remaining),
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof NotConfiguredError
        ? ERROR_MESSAGES.indexerDown
        : ERROR_MESSAGES.indexerDown;
    // The raw technical error is never sent to the browser.
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

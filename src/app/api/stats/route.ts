import { NextResponse } from 'next/server';
import { dataSource } from '@/lib/data';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { ERROR_MESSAGES } from '@/lib/domain/copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const limit = rateLimit(`stats:${clientKey(request)}`, 60, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(limit.resetInSeconds) } },
    );
  }

  try {
    const stats = await dataSource.getStats();
    return NextResponse.json(
      { stats },
      { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' } },
    );
  } catch {
    return NextResponse.json({ error: ERROR_MESSAGES.indexerDown }, { status: 503 });
  }
}

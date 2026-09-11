import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WalletProfileView } from '@/components/wallet/WalletProfileView';
import { Container } from '@/components/ui/Panel';
import { ErrorState } from '@/components/ui/States';
import { ButtonLink } from '@/components/ui/Button';
import { WalletSearch } from '@/components/wallet/WalletSearch';
import { dataSource, NotConfiguredError } from '@/lib/data';
import { validateAddress } from '@/lib/utils';
import { buildProfile } from '@/lib/domain/survival';
import { computeAchievements } from '@/lib/domain/achievements';
import { daysFrom, formatGraveNumber, shortAddress } from '@/lib/domain/format';
import { ERROR_MESSAGES } from '@/lib/domain/copy';
import type { WalletProfile } from '@/lib/domain/types';

/** Wallet pages depend on live timing, so they are rendered per request. */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ address: string }> };

/**
 * Loads a wallet.
 *
 * A wallet with no recorded activity is NOT an error — it is the
 * "NOT YET DEAD" state, and we return an empty but valid profile for it.
 */
async function loadProfile(rawAddress: string): Promise<
  | { ok: true; profile: WalletProfile }
  | { ok: false; reason: 'invalid' | 'unavailable' }
> {
  const { valid, address } = validateAddress(rawAddress);
  if (!valid || !address) return { ok: false, reason: 'invalid' };

  try {
    const found = await dataSource.getWalletProfile(address);
    if (found) return { ok: true, profile: found };

    // No history recorded. Build an honest empty profile.
    const empty = buildProfile(address, [], { isDemo: dataSource.mode === 'demo' });
    empty.achievements = computeAchievements(empty);
    return { ok: true, profile: empty };
  } catch (error) {
    if (error instanceof NotConfiguredError) return { ok: false, reason: 'unavailable' };
    return { ok: false, reason: 'unavailable' };
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { address } = await params;
  const result = await loadProfile(address);

  if (!result.ok) {
    return { title: 'Wallet not found', robots: { index: false, follow: false } };
  }

  const { profile } = result;
  const short = shortAddress(profile.address);

  const description =
    profile.state === 'ALIVE'
      ? `Wallet ${short} is ALIVE for ${daysFrom(profile.currentLifeSeconds)} days.`
      : profile.state === 'RESURRECTED'
        ? `Wallet ${short} came back from the dead. ${profile.deaths} deaths, ${profile.resurrections} resurrections.`
        : profile.state === 'DEAD'
          ? `Wallet ${short} is DEAD. ${profile.graves.length > 0 ? `Grave ${formatGraveNumber(profile.graves[profile.graves.length - 1].graveNumber)}.` : ''}`
          : `Wallet ${short} has no $RIP story yet. Its grave is still available.`;

  const title = `${short} — ${profile.state === 'NEVER' ? 'NOT YET DEAD' : profile.state}`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'profile' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function WalletPage({ params }: Params) {
  const { address } = await params;
  const result = await loadProfile(address);

  if (!result.ok && result.reason === 'invalid') {
    return (
      <Container className="py-16">
        <ErrorState
          emoji="🚫"
          title="Invalid wallet address"
          message={ERROR_MESSAGES.invalidAddress}
          action={
            <div className="mt-4 w-full max-w-lg">
              <WalletSearch size="md" showExamples={false} />
            </div>
          }
        />
      </Container>
    );
  }

  if (!result.ok) {
    return (
      <Container className="py-16">
        <ErrorState
          emoji="⛏️"
          title="The cemetery is updating"
          message={ERROR_MESSAGES.indexerDown}
          action={
            <ButtonLink href="/" variant="secondary" size="md" className="mt-4">
              BACK TO SAFETY
            </ButtonLink>
          }
        />
      </Container>
    );
  }

  if (!result.profile) notFound();

  return <WalletProfileView profile={result.profile} />;
}

import type { Metadata } from 'next';
import { Container, SectionHeading } from '@/components/ui/Panel';
import { WalletRow } from '@/components/wallet/WalletRow';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ButtonLink } from '@/components/ui/Button';
import { dataSource } from '@/lib/data';
import { formatLifespan } from '@/lib/domain/format';
import { STATE_COPY, EMPTY_STATES, ERROR_MESSAGES } from '@/lib/domain/copy';
import type { ResurrectedEntry } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Resurrected',
  description: 'Some wallets refuse to stay dead. Wallets that died and bought back in.',
};

export default async function ResurrectedPage() {
  let entries: ResurrectedEntry[] = [];
  let total = 0;
  let unavailable = false;

  try {
    const page = await dataSource.getResurrected({ limit: 50 });
    entries = page.items;
    total = page.total;
  } catch {
    unavailable = true;
  }

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow={`${total.toLocaleString('en-US')} came back`}
        title={<><span aria-hidden>⚡</span> THE RESURRECTED</>}
        subtitle="Some wallets refuse to stay dead. Each one sold out completely, then bought $RIP again and started a brand new life."
      />

      <div className="mt-8 space-y-3">
        {unavailable ? (
          <ErrorState
            emoji="⛏️"
            title="The cemetery is updating"
            message={ERROR_MESSAGES.indexerDown}
            action={
              <ButtonLink href="/" variant="secondary" size="md" className="mt-4">
                BACK HOME
              </ButtonLink>
            }
          />
        ) : entries.length === 0 ? (
          <EmptyState emoji="⚡" message={EMPTY_STATES.resurrected} />
        ) : (
          entries.map((entry, index) => {
            const copy = STATE_COPY[entry.currentState];
            return (
              <WalletRow
                key={entry.address}
                address={entry.address}
                rank={index + 1}
                isDemo={entry.isDemo}
                primary={
                  <span className="text-reborn">
                    {entry.resurrections}{' '}
                    {entry.resurrections === 1 ? 'return' : 'returns'}
                  </span>
                }
                secondary={
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={copy.textClass}>
                      {copy.emoji} {copy.headline}
                    </span>
                    <span className="text-dead">
                      {entry.deaths} {entry.deaths === 1 ? 'death' : 'deaths'}
                    </span>
                    <span>Longest: {formatLifespan(entry.longestLifeSeconds)}</span>
                  </span>
                }
                trailing={`${formatLifespan(entry.totalLifetimeSeconds)} total`}
              />
            );
          })
        )}
      </div>
    </Container>
  );
}

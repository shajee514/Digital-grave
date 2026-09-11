import type { Metadata } from 'next';
import { Container, SectionHeading } from '@/components/ui/Panel';
import { LinkTabs, type TabOption } from '@/components/ui/Tabs';
import { WalletRow } from '@/components/wallet/WalletRow';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ButtonLink } from '@/components/ui/Button';
import { dataSource } from '@/lib/data';
import { compactAmount, formatLifespan } from '@/lib/domain/format';
import { levelDefinition } from '@/lib/domain/levels';
import { EMPTY_STATES, ERROR_MESSAGES } from '@/lib/domain/copy';
import { cn } from '@/lib/utils';
import type { LivingEntry, LivingSort } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Living',
  description: 'Wallets currently holding $RIP, ranked by how long they have survived.',
};

const SORTS: TabOption[] = [
  { key: 'longest-survival', label: 'Longest Survival' },
  { key: 'largest-holder', label: 'Largest Holder' },
  { key: 'most-transactions', label: 'Most Transactions' },
  { key: 'highest-level', label: 'Highest Level' },
];

const VALID = new Set(SORTS.map((s) => s.key));

export default async function LivingPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: rawSort } = await searchParams;
  const sort = (VALID.has(rawSort ?? '') ? rawSort : 'longest-survival') as LivingSort;

  let entries: LivingEntry[] = [];
  let total = 0;
  let unavailable = false;

  try {
    const page = await dataSource.getLiving({ sort, limit: 50 });
    entries = page.items;
    total = page.total;
  } catch {
    unavailable = true;
  }

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow={`${total.toLocaleString('en-US')} still breathing`}
        title={<><span aria-hidden>🟢</span> THE LIVING</>}
        subtitle="Wallets that currently hold $RIP. The timer keeps running until the whole position is sold."
      />

      <div className="mt-8">
        <LinkTabs
          options={SORTS}
          active={sort}
          buildHref={(key) =>
            key === 'longest-survival' ? '/living' : `/living?sort=${key}`
          }
        />
      </div>

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
          <EmptyState emoji="🌱" message={EMPTY_STATES.living} />
        ) : (
          entries.map((entry, index) => {
            const level = levelDefinition(entry.level);
            return (
              <WalletRow
                key={entry.address}
                address={entry.address}
                rank={index + 1}
                isDemo={entry.isDemo}
                primary={
                  <span className="text-alive">
                    {formatLifespan(entry.holdingSeconds)}
                  </span>
                }
                secondary={
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={cn('font-semibold', level.colorClass)}>
                      {entry.level}
                    </span>
                    <span>{compactAmount(entry.balance)} $RIP</span>
                    <span>
                      {entry.transactionCount}{' '}
                      {entry.transactionCount === 1 ? 'tx' : 'txs'}
                    </span>
                  </span>
                }
                trailing="alive"
              />
            );
          })
        )}
      </div>
    </Container>
  );
}

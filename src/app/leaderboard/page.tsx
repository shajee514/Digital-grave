import type { Metadata } from 'next';
import { Container, SectionHeading } from '@/components/ui/Panel';
import { LinkTabs, type TabOption } from '@/components/ui/Tabs';
import { WalletRow } from '@/components/wallet/WalletRow';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ButtonLink } from '@/components/ui/Button';
import { dataSource } from '@/lib/data';
import { STATE_COPY, EMPTY_STATES, ERROR_MESSAGES } from '@/lib/domain/copy';
import type { LeaderboardRow, LeaderboardSection } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description:
    'The longest survivors, the biggest holders, and the wallets that die the most.',
};

const SECTIONS: TabOption[] = [
  { key: 'longest-survivors', label: 'Longest Survivors' },
  { key: 'biggest-survivors', label: 'Biggest Survivors' },
  { key: 'most-resurrected', label: 'Most Resurrected' },
  { key: 'most-deaths', label: 'Most Deaths' },
  { key: 'oldest-living', label: 'Oldest Living Wallets' },
];

const VALID = new Set(SECTIONS.map((s) => s.key));

const BLURBS: Record<LeaderboardSection, string> = {
  'longest-survivors': 'Ranked by the length of the current unbroken life.',
  'biggest-survivors': 'Ranked by the size of the position currently held.',
  'most-resurrected': 'Ranked by how many times a wallet came back after dying.',
  'most-deaths': 'Ranked by how many graves a wallet has collected.',
  'oldest-living': 'Ranked by the first recorded $RIP activity, still holding today.',
};

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section: rawSection } = await searchParams;
  const section = (
    VALID.has(rawSection ?? '') ? rawSection : 'longest-survivors'
  ) as LeaderboardSection;

  let rows: LeaderboardRow[] = [];
  let unavailable = false;

  try {
    rows = await dataSource.getLeaderboard(section, 25);
  } catch {
    unavailable = true;
  }

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Public data only"
        title={<><span aria-hidden>🏆</span> LEADERBOARD</>}
        subtitle="Built entirely from indexed blockchain activity. Only public, shortened addresses and on-chain figures are shown."
      />

      <div className="mt-8">
        <LinkTabs
          options={SECTIONS}
          active={section}
          buildHref={(key) =>
            key === 'longest-survivors' ? '/leaderboard' : `/leaderboard?section=${key}`
          }
        />
      </div>

      <p className="mt-6 text-sm text-ash">{BLURBS[section]}</p>

      <div className="mt-6 space-y-3">
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
        ) : rows.length === 0 ? (
          <EmptyState emoji="🏆" message={EMPTY_STATES.leaderboard} />
        ) : (
          rows.map((row) => {
            const copy = STATE_COPY[row.state];
            return (
              <WalletRow
                key={`${section}-${row.address}`}
                address={row.address}
                rank={row.rank}
                isDemo={row.isDemo}
                primary={row.primaryValue}
                secondary={
                  <span className={copy.textClass}>
                    {copy.emoji} {copy.headline}
                  </span>
                }
                trailing={row.secondaryValue}
              />
            );
          })
        )}
      </div>
    </Container>
  );
}

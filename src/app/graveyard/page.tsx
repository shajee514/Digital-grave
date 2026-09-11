import type { Metadata } from 'next';
import { Container, SectionHeading } from '@/components/ui/Panel';
import { LinkTabs, type TabOption } from '@/components/ui/Tabs';
import { GraveCard } from '@/components/grave/GraveCard';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ButtonLink } from '@/components/ui/Button';
import { dataSource } from '@/lib/data';
import { EMPTY_STATES, ERROR_MESSAGES } from '@/lib/domain/copy';
import type { GraveyardEntry, GraveyardFilter } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Graveyard',
  description:
    'Every wallet that sold its whole $RIP position gets a grave. Browse the cemetery.',
};

const FILTERS: TabOption[] = [
  { key: 'all', label: 'All Graves' },
  { key: 'recent', label: 'Recent Deaths' },
  { key: 'longest', label: 'Longest Lives' },
  { key: 'shortest', label: 'Shortest Lives' },
  { key: 'most-deaths', label: 'Most Deaths' },
  { key: 'funniest', label: 'Funniest Causes' },
];

const VALID = new Set(FILTERS.map((f) => f.key));

export default async function GraveyardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter = (VALID.has(rawFilter ?? '') ? rawFilter : 'all') as GraveyardFilter;

  let graves: GraveyardEntry[] = [];
  let total = 0;
  let unavailable = false;

  try {
    const page = await dataSource.getGraves({ filter, limit: 36 });
    graves = page.items;
    total = page.total;
  } catch {
    // Any failure here means the database is not ready to answer yet.
    unavailable = true;
  }

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow={`${total.toLocaleString('en-US')} graves dug`}
        title={<><span aria-hidden>🪦</span> THE GRAVEYARD</>}
        subtitle="Every wallet here bought $RIP and later sold its entire position. Moving tokens to another wallet does not put you in the ground."
      />

      <div className="mt-8">
        <LinkTabs
          options={FILTERS}
          active={filter}
          buildHref={(key) => (key === 'all' ? '/graveyard' : `/graveyard?filter=${key}`)}
        />
      </div>

      <div className="mt-8">
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
        ) : graves.length === 0 ? (
          <EmptyState
            message={
              filter === 'all'
                ? EMPTY_STATES.graveyard
                : 'No graves match this filter yet.'
            }
            action={
              <ButtonLink href="/graveyard" variant="secondary" size="sm">
                SHOW ALL GRAVES
              </ButtonLink>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {graves.map((grave) => (
              <GraveCard key={grave.id} grave={grave} isDemo={grave.isDemo} compact />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

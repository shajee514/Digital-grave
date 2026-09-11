import { Hero } from '@/components/home/Hero';
import { StateShowcase } from '@/components/home/StateShowcase';
import { CemeteryStatsBar } from '@/components/home/CemeteryStatsBar';
import { LifeCycle } from '@/components/home/LifeCycle';
import { GraveCard } from '@/components/grave/GraveCard';
import { FamousGraves } from '@/components/home/FamousGraves';
import { Container, SectionHeading } from '@/components/ui/Panel';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { SURVIVAL_LEVELS } from '@/lib/domain/levels';
import { EMPTY_STATES } from '@/lib/domain/copy';
import { dataSource } from '@/lib/data';
import { cn } from '@/lib/utils';

/** Demo data is time-based, so the homepage is rendered per request. */
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [stats, recentGraves] = await Promise.all([
    dataSource.getStats(),
    dataSource.getGraves({ filter: 'recent', limit: 3 }),
  ]);

  return (
    <>
      <Hero />

      <Container className="pb-8">
        <CemeteryStatsBar stats={stats} />
      </Container>

      <Container className="py-16">
        <SectionHeading
          eyebrow="The whole idea"
          title="Four answers. One wallet."
          subtitle="Paste any public wallet address and the cemetery tells you exactly one thing: what happened to it. Nothing is guessed, and nothing is invented."
        />
        <div className="mt-8">
          <StateShowcase />
        </div>
      </Container>

      <Container className="py-16">
        <SectionHeading
          eyebrow="The loop"
          title="Buy. Hold. Live. Sell. Die."
          subtitle="Every wallet moves through the same cycle. Your position on that cycle is your story."
        />
        <div className="mt-8">
          <LifeCycle />
        </div>
      </Container>

      <Container className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Fresh soil"
            title="Recent deaths"
            subtitle="The most recent wallets to sell their entire position."
          />
          <ButtonLink href="/graveyard" variant="secondary" size="sm">
            VIEW ALL GRAVES
          </ButtonLink>
        </div>

        <div className="mt-8">
          {recentGraves.items.length === 0 ? (
            <EmptyState message={EMPTY_STATES.graveyard} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentGraves.items.map((grave) => (
                <GraveCard key={grave.id} grave={grave} isDemo={grave.isDemo} />
              ))}
            </div>
          )}
        </div>
      </Container>

      <Container className="py-16">
        <FamousGraves />
      </Container>

      <Container className="py-16">
        <SectionHeading
          eyebrow="Cosmetic only"
          title="Survival levels"
          subtitle="Hold longer, rank higher. These are bragging rights and nothing else — they carry no financial value or entitlement of any kind."
        />
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SURVIVAL_LEVELS.map((level) => (
            <div
              key={level.level}
              className="stone-panel stone-panel-hover flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className={cn('font-display text-base font-bold tracking-tight', level.colorClass)}>
                  {level.level}
                </p>
                <p className="mt-1 truncate text-xs text-ash">{level.blurb}</p>
              </div>
              <span className="shrink-0 rounded-lg border border-moss bg-granite/60 px-2.5 py-1.5 font-mono text-[0.7rem] text-ash">
                {level.maxDays === null
                  ? `${level.minDays}d+`
                  : `${level.minDays}-${level.maxDays}d`}
              </span>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <div className="stone-panel flex flex-col items-center gap-6 px-6 py-14 text-center">
          <span className="text-5xl" aria-hidden>
            🪦
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Your grave is still available.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ash">
            Everyone dies. Paper hands die first. Find out where a wallet stands.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/search" size="lg">
              SEARCH A WALLET
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="secondary" size="lg">
              HOW IT WORKS
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}

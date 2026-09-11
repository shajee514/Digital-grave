import Link from 'next/link';
import { Container, Panel, SectionHeading, Stat } from '@/components/ui/Panel';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { SurvivalTimer } from '@/components/wallet/SurvivalTimer';
import { LivesTimeline } from '@/components/wallet/LivesTimeline';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { AchievementGrid } from '@/components/wallet/AchievementGrid';
import { LuckySurvivor } from '@/components/wallet/LuckySurvivor';
import { GraveCard } from '@/components/grave/GraveCard';
import { ShareActions } from '@/components/grave/ShareActions';
import { Gravestone } from '@/components/brand/Gravestone';
import { STATE_COPY } from '@/lib/domain/copy';
import { levelDefinition, levelProgress } from '@/lib/domain/levels';
import {
  formatAmount,
  formatDate,
  formatGraveNumber,
  formatLifespan,
  shortAddress,
} from '@/lib/domain/format';
import { explorerLink } from '@/lib/config/chain';
import { shareTextForProfile, absoluteUrl } from '@/lib/share';
import { cn } from '@/lib/utils';
import type { WalletProfile } from '@/lib/domain/types';

/** The complete public profile for one wallet. */
export function WalletProfileView({
  profile,
  title = 'Wallet',
}: {
  profile: WalletProfile;
  title?: string;
}) {
  const copy = STATE_COPY[profile.state];
  const isHolding = profile.state === 'ALIVE' || profile.state === 'RESURRECTED';
  const latestGrave =
    profile.graves.length > 0 ? profile.graves[profile.graves.length - 1] : null;
  const addressLink = explorerLink('address', profile.address);
  const shareUrl = absoluteUrl(`/wallet/${profile.address}`);

  return (
    <Container className="py-10 sm:py-14">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={copy.accent}>{title}</Badge>
          {profile.isDemo ? <DemoBadge /> : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-bone sm:text-3xl">
            {shortAddress(profile.address, 6, 6)}
          </h1>
          <CopyButton value={profile.address} label="COPY ADDRESS" />
          {addressLink ? (
            <a
              href={addressLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-moss bg-granite/60 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:border-ash/60 hover:text-bone"
            >
              EXPLORER ↗
            </a>
          ) : null}
        </div>
      </div>

      {/* ---------- The verdict ---------- */}
      <div
        className={cn(
          'mt-8 overflow-hidden rounded-2xl border bg-gradient-to-b from-stone to-soil',
          copy.borderClass,
        )}
      >
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>
                {copy.emoji}
              </span>
              <h2
                className={cn(
                  'engraved font-display text-4xl font-bold tracking-tight sm:text-5xl',
                  copy.textClass,
                )}
              >
                {copy.headline}
              </h2>
            </div>

            {/* The honest explanation. Always shown, in plain language. */}
            <p className="mt-5 rounded-xl border border-moss bg-granite/40 p-4 text-sm leading-relaxed text-bone">
              {copy.explanation}
            </p>

            <div className="mt-4 space-y-1">
              {copy.lines.map((line) => (
                <p key={line} className="text-sm text-ash">
                  {line}
                </p>
              ))}
            </div>

            {profile.state !== 'NEVER' ? (
              <div className="mt-6">
                <ShareActions shareUrl={shareUrl} shareText={shareTextForProfile(profile)} />
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/token" size="md">
                  START A LIFE
                </ButtonLink>
                <ButtonLink href="/graveyard" variant="secondary" size="md">
                  BROWSE THE GRAVEYARD
                </ButtonLink>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Gravestone className="h-52 w-52 sm:h-64 sm:w-64" accent={copy.accent} />
          </div>
        </div>
      </div>

      {/* ---------- Nothing recorded yet ---------- */}
      {profile.state === 'NEVER' ? (
        <Panel className="mt-6 text-center">
          <p className="text-sm text-ash">
            When this wallet buys {profile.isDemo ? 'the demo token' : '$RIP'}, a
            life will start here and the survival timer will begin.
          </p>
        </Panel>
      ) : null}

      {/* ---------- Alive / resurrected ---------- */}
      {isHolding && profile.currentLifeStartedAt !== null ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Panel>
            <SurvivalTimer
              startedAt={profile.currentLifeStartedAt}
              initialSeconds={profile.currentLifeSeconds}
              accent={profile.state === 'RESURRECTED' ? 'reborn' : 'alive'}
            />
            <p className="mt-4 text-xs text-ash">
              Running since {formatDate(profile.currentLifeStartedAt)}. The timer
              resets only if the whole position is sold.
            </p>
          </Panel>

          <Panel className="flex flex-col justify-between gap-6">
            <Stat
              label="Current Balance"
              value={
                <>
                  {formatAmount(profile.currentBalance)}{' '}
                  <span className="text-base text-ash">$RIP</span>
                </>
              }
            />
            {profile.survivalLevel ? (
              <SurvivalLevelMeter seconds={profile.currentLifeSeconds} />
            ) : null}
          </Panel>
        </div>
      ) : null}

      {/* ---------- Lives and deaths ---------- */}
      {profile.state !== 'NEVER' ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Panel className="p-4">
            <Stat label="Total Lives" value={profile.totalLives} />
          </Panel>
          <Panel className="p-4">
            <Stat label="Deaths" value={profile.deaths} valueClass="text-dead" />
          </Panel>
          <Panel className="p-4">
            <Stat
              label="Resurrections"
              value={profile.resurrections}
              valueClass="text-reborn"
            />
          </Panel>
          <Panel className="p-4">
            <Stat
              label="Longest Life"
              value={
                <span className="text-xl sm:text-2xl">
                  {formatLifespan(profile.longestLifeSeconds)}
                </span>
              }
            />
          </Panel>
        </div>
      ) : null}

      {/* ---------- Most recent grave ---------- */}
      {latestGrave ? (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Most recent death"
              title={`Grave ${formatGraveNumber(latestGrave.graveNumber)}`}
            />
            <Link
              href={`/grave/${latestGrave.graveNumber}`}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:text-bone"
            >
              Open grave page →
            </Link>
          </div>
          <div className="mt-6 max-w-md">
            <GraveCard grave={latestGrave} isDemo={profile.isDemo} />
          </div>
        </section>
      ) : null}

      {/* ---------- Every life ---------- */}
      {profile.sessions.length > 0 ? (
        <section className="mt-14">
          <SectionHeading
            eyebrow="The full story"
            title="Every life"
            subtitle="Each life is one unbroken stretch of holding. A life only ends in a grave when the position was actually sold."
          />
          <div className="mt-6">
            <LivesTimeline sessions={profile.sessions} />
          </div>
        </section>
      ) : null}

      {/* ---------- All graves ---------- */}
      {profile.graves.length > 1 ? (
        <section className="mt-14">
          <SectionHeading eyebrow="Collection" title="All graves" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.graves.map((grave) => (
              <GraveCard key={grave.id} grave={grave} isDemo={profile.isDemo} compact />
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------- Lucky Survivor ---------- */}
      {isHolding ? (
        <section className="mt-14">
          <LuckySurvivor currentLifeSeconds={profile.currentLifeSeconds} />
        </section>
      ) : null}

      {/* ---------- Achievements ---------- */}
      {profile.state !== 'NEVER' ? (
        <section className="mt-14">
          <SectionHeading
            eyebrow="Cosmetic only"
            title="Achievements"
            subtitle="Badges are bragging rights. They carry no financial value or entitlement."
          />
          <div className="mt-6">
            <AchievementGrid achievements={profile.achievements} />
          </div>
        </section>
      ) : null}

      {/* ---------- Transactions ---------- */}
      {profile.transactions.length > 0 ? (
        <section className="mt-14">
          <SectionHeading
            eyebrow="Source of truth"
            title="Transaction history"
            subtitle="Buys and sells are only labelled as such when they went through a known DEX address. Everything else is shown as a plain transfer."
          />
          <Panel className="mt-6 p-0 sm:p-0">
            <div className="p-4 sm:p-5">
              <TransactionHistory transactions={profile.transactions} limit={50} />
            </div>
          </Panel>
        </section>
      ) : null}
    </Container>
  );
}

/** Progress bar toward the next cosmetic survival tier. */
function SurvivalLevelMeter({ seconds }: { seconds: number }) {
  const { current, next, progress, daysToNext } = levelProgress(seconds);
  const definition = levelDefinition(current.level);

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="label-caps">Survival Level</span>
          <p
            className={cn(
              'mt-1 font-display text-2xl font-bold tracking-tight',
              definition.colorClass,
            )}
          >
            {current.level}
          </p>
        </div>
        {next ? (
          <span className="text-right text-[0.7rem] leading-tight text-ash">
            {daysToNext}d to
            <br />
            <span className="font-semibold text-bone">{next.level}</span>
          </span>
        ) : (
          <span className="text-[0.7rem] font-semibold text-legendary">MAX TIER</span>
        )}
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-granite">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700',
            next ? 'bg-alive' : 'bg-legendary',
          )}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs italic text-ash">{definition.blurb}</p>
    </div>
  );
}

import { publicEnv } from '@/lib/config/env';
import { daysFrom } from '@/lib/domain/format';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

/**
 * LUCKY SURVIVOR — milestone architecture only.
 *
 * Real-money rewards are deliberately NOT active. Until legal review and a
 * verifiable-randomness contract design are complete, milestones are shown
 * as cosmetic digital collectibles and clearly labelled as such.
 */
const MILESTONES = [7, 30, 90, 180, 365];

export function LuckySurvivor({ currentLifeSeconds }: { currentLifeSeconds: number }) {
  const days = daysFrom(currentLifeSeconds);

  return (
    <div className="stone-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl" aria-hidden>
            🛡️
          </span>
          <h3 className="font-display text-lg font-bold tracking-tight">
            Lucky Survivor
          </h3>
        </div>
        <Badge tone={publicEnv.rewardsEnabled ? 'alive' : 'neutral'}>
          {publicEnv.rewardsEnabled ? 'Collectibles active' : 'Not active yet'}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ash">
        Survive long enough and you unlock a milestone.{' '}
        <span className="text-bone">
          These are cosmetic digital collectibles.
        </span>{' '}
        No cash rewards are offered, promised or payable, and nothing here is an
        investment or a return.
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {MILESTONES.map((milestone) => {
          const reached = days >= milestone;
          return (
            <li
              key={milestone}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border py-4 text-center transition-all',
                reached
                  ? 'border-legendary/40 bg-legendary/10'
                  : 'border-moss bg-granite/30',
              )}
            >
              <span className="text-lg" aria-hidden>
                {reached ? '🎁' : '🔒'}
              </span>
              <span
                className={cn(
                  'font-display text-base font-bold',
                  reached ? 'text-legendary' : 'text-ash',
                )}
              >
                {milestone}D
              </span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ash">
                {reached ? 'Survived' : `${milestone - days}d to go`}
              </span>
            </li>
          );
        })}
      </ul>

      {!publicEnv.rewardsEnabled ? (
        <p className="mt-5 rounded-xl border border-moss bg-granite/40 p-3 font-mono text-[0.7rem] leading-relaxed text-ash">
          CONFIGURATION REQUIRED — the reward system stays switched off until
          legal review is complete and the randomness is publicly verifiable on
          chain. No administrator is able to choose individual winners.
        </p>
      ) : null}
    </div>
  );
}

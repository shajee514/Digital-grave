import { formatDate, formatLifespan } from '@/lib/domain/format';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { SurvivalSession } from '@/lib/domain/types';

/** Shows every life the wallet has lived, oldest first. */
export function LivesTimeline({ sessions }: { sessions: SurvivalSession[] }) {
  if (sessions.length === 0) return null;

  return (
    <ol className="relative space-y-3 pl-6">
      {/* The vertical thread running through every life */}
      <span
        className="absolute left-[0.34rem] top-2 bottom-2 w-px bg-gradient-to-b from-moss via-moss to-transparent"
        aria-hidden
      />

      {sessions.map((session) => {
        const alive = session.isActive;
        const moved = session.endedBy === 'TRANSFER_OUT';

        return (
          <li key={session.id} className="relative">
            <span
              className={cn(
                'absolute -left-[1.35rem] top-5 h-3 w-3 rounded-full border-2 border-void',
                alive ? 'bg-alive animate-pulse-glow' : moved ? 'bg-ash' : 'bg-dead',
              )}
              aria-hidden
            />
            <div
              className={cn(
                'stone-panel flex flex-wrap items-center justify-between gap-4 p-4',
                alive && 'border-alive/30 bg-alive/[0.04]',
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-bold tracking-wide">
                    LIFE #{session.lifeNumber}
                  </span>
                  {alive ? (
                    <Badge tone="alive">Ongoing</Badge>
                  ) : moved ? (
                    <Badge tone="neutral">Moved out</Badge>
                  ) : (
                    <Badge tone="dead">Ended in a sale</Badge>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-ash">
                  {formatDate(session.startedAt)}
                  {' → '}
                  {session.endedAt ? formatDate(session.endedAt) : 'now'}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    'font-display text-lg font-bold tracking-tight',
                    alive ? 'text-alive' : 'text-bone',
                  )}
                >
                  {formatLifespan(session.durationSeconds)}
                </p>
                <p className="label-caps mt-0.5">Lifespan</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

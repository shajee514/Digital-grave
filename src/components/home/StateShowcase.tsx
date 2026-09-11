import { STATE_COPY } from '@/lib/domain/copy';
import type { WalletState } from '@/lib/domain/types';
import { cn } from '@/lib/utils';

const ORDER: WalletState[] = ['NEVER', 'ALIVE', 'DEAD', 'RESURRECTED'];

const DETAIL: Record<WalletState, string> = {
  NEVER: 'No $RIP activity has ever been recorded for the wallet.',
  ALIVE: 'The wallet holds $RIP right now, and has never sold out.',
  DEAD: 'The wallet held $RIP before and sold its whole position.',
  RESURRECTED: 'The wallet died, then bought back in. A new life started.',
};

/** The four answers the site can give. This is the whole product in one row. */
export function StateShowcase() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ORDER.map((state, index) => {
        const copy = STATE_COPY[state];
        return (
          <div
            key={state}
            className={cn(
              'stone-panel stone-panel-hover flex flex-col gap-3 border p-5',
              copy.borderClass,
              copy.bgClass,
            )}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="text-3xl" aria-hidden>
              {copy.emoji}
            </span>
            <h3 className={cn('font-display text-xl font-bold tracking-tight', copy.textClass)}>
              {copy.headline}
            </h3>
            <p className="text-sm leading-relaxed text-ash">{DETAIL[state]}</p>
          </div>
        );
      })}
    </div>
  );
}

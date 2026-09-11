import Link from 'next/link';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import {
  formatDate,
  formatGraveNumber,
  formatLifespan,
  shortAddress,
} from '@/lib/domain/format';
import { causeFlavour } from '@/lib/domain/causes';
import { site } from '@/lib/config/site';
import { cn } from '@/lib/utils';
import type { Grave } from '@/lib/domain/types';

/**
 * The shareable gravestone card.
 *
 * Only the shortened wallet address is shown. The full address is never
 * printed on the card itself.
 */
export function GraveCard({
  grave,
  isDemo = false,
  compact = false,
  linkToGrave = true,
  className,
}: {
  grave: Grave;
  isDemo?: boolean;
  compact?: boolean;
  linkToGrave?: boolean;
  className?: string;
}) {
  const resurrected = grave.status === 'RESURRECTED';

  const body = (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-stone via-stone to-soil p-5 shadow-engraved transition-all duration-300 sm:p-6',
        resurrected
          ? 'border-reborn/30 hover:border-reborn/60'
          : 'border-moss hover:border-dead/50',
        linkToGrave && 'hover:-translate-y-1',
        className,
      )}
    >
      {/* Faint arch, echoing the gravestone silhouette */}
      <div
        className="pointer-events-none absolute inset-x-6 top-4 bottom-0 rounded-t-[50%_18%] border border-white/[0.04]"
        aria-hidden
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ash">
            🪦 {site.name}
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-bone">
            GRAVE {formatGraveNumber(grave.graveNumber)}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {isDemo ? <DemoBadge /> : null}
          {resurrected ? <Badge tone="reborn">⚡ Returned</Badge> : null}
        </div>
      </header>

      {/* Cause of death — the punchline */}
      <div className="relative mt-5 border-y border-moss/70 py-4 text-center">
        <span className="label-caps">Cause of Death</span>
        <p
          className={cn(
            'engraved mt-2 font-display font-bold uppercase leading-tight tracking-tight',
            compact ? 'text-xl' : 'text-2xl sm:text-3xl',
            resurrected ? 'text-reborn' : 'text-dead',
          )}
        >
          {grave.causeOfDeath}
        </p>
        {!compact ? (
          <p className="mt-1.5 text-xs italic text-ash">
            {causeFlavour(grave.causeOfDeath)}
          </p>
        ) : null}
      </div>

      <dl className="relative mt-5 grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2">
          <dt className="label-caps">Wallet</dt>
          <dd className="mt-1 font-mono text-bone">
            {shortAddress(grave.walletAddress)}
          </dd>
        </div>
        <div>
          <dt className="label-caps">Born</dt>
          <dd className="mt-1 text-bone">{formatDate(grave.bornAt)}</dd>
        </div>
        <div>
          <dt className="label-caps">Died</dt>
          <dd className="mt-1 text-bone">{formatDate(grave.diedAt)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="label-caps">Lifespan</dt>
          <dd className="mt-1 font-display text-xl font-bold text-bone">
            {formatLifespan(grave.lifespanSeconds)}
          </dd>
        </div>
      </dl>

      <footer className="relative mt-auto flex items-end justify-between gap-3 pt-5">
        <p className="text-[0.65rem] leading-relaxed text-ash/80">
          Everyone dies.
          <br />
          Paper hands die first.
        </p>
        <span className="font-mono text-sm font-bold tracking-[0.1em] text-alive">
          $RIP
        </span>
      </footer>
    </article>
  );

  if (!linkToGrave) return body;

  return (
    <Link
      href={`/grave/${grave.graveNumber}`}
      className="block h-full focus-visible:rounded-2xl"
      aria-label={`Open grave ${formatGraveNumber(grave.graveNumber)}`}
    >
      {body}
    </Link>
  );
}

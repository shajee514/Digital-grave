import Link from 'next/link';
import { DemoBadge } from '@/components/ui/Badge';
import { shortAddress } from '@/lib/domain/format';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/** One wallet row, used by the living wall, resurrected page and leaderboard. */
export function WalletRow({
  address,
  rank,
  isDemo,
  dotClass,
  primary,
  secondary,
  trailing,
}: {
  address: string;
  rank?: number;
  isDemo?: boolean;
  dotClass?: string;
  primary: ReactNode;
  secondary?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <Link
      href={`/wallet/${address}`}
      className="stone-panel stone-panel-hover flex items-center gap-4 p-4"
    >
      {rank !== undefined ? (
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold',
            rank === 1
              ? 'border-legendary/50 bg-legendary/10 text-legendary'
              : rank <= 3
                ? 'border-ash/40 bg-granite text-bone'
                : 'border-moss bg-granite/50 text-ash',
          )}
        >
          {rank}
        </span>
      ) : dotClass ? (
        <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', dotClass)} aria-hidden />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-bone">
            {shortAddress(address, 6, 4)}
          </span>
          {isDemo ? <DemoBadge /> : null}
        </div>
        {secondary ? (
          <div className="mt-1 text-xs text-ash">{secondary}</div>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="font-display text-sm font-bold tracking-tight text-bone sm:text-base">
          {primary}
        </div>
        {trailing ? <div className="mt-0.5 text-xs text-ash">{trailing}</div> : null}
      </div>
    </Link>
  );
}

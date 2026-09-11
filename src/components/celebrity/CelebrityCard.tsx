import Link from 'next/link';
import { CelebrityAvatar } from './CelebrityAvatar';
import { ParodyTag } from './ParodyDisclaimer';
import { formatGraveNumber } from '@/lib/domain/format';
import { site } from '@/lib/config/site';
import { cn } from '@/lib/utils';
import type { Celebrity } from '@/lib/celebrities/types';

/**
 * A celebrity grave card.
 *
 * Deliberately mirrors the layout language of the real GraveCard used for
 * wallets, so the two feel like the same cemetery — but this one always
 * carries a FICTIONAL PARODY tag and never mentions balances or holdings.
 */

const ACCENT_CLASSES = {
  alive: { border: 'hover:border-alive/60', text: 'text-alive', ring: 'bg-alive/10' },
  dead: { border: 'hover:border-dead/60', text: 'text-dead', ring: 'bg-dead/10' },
  reborn: { border: 'hover:border-reborn/60', text: 'text-reborn', ring: 'bg-reborn/10' },
  legendary: {
    border: 'hover:border-legendary/60',
    text: 'text-legendary',
    ring: 'bg-legendary/10',
  },
  ghost: { border: 'hover:border-ghost/60', text: 'text-ghost', ring: 'bg-ghost/10' },
} as const;

export function CelebrityCard({
  celebrity,
  className,
}: {
  celebrity: Celebrity;
  className?: string;
}) {
  const accent = ACCENT_CLASSES[celebrity.avatar.accent];

  return (
    <Link
      href={`/celebrities/${celebrity.slug}`}
      className={cn('group block h-full focus-visible:rounded-2xl', className)}
      aria-label={`Open the fictional parody grave of ${celebrity.displayName}`}
    >
      <article
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-2xl border border-moss bg-gradient-to-b from-stone via-stone to-soil p-5 shadow-engraved transition-all duration-300 group-hover:-translate-y-1 sm:p-6',
          accent.border,
        )}
      >
        {/* Glow that wakes up on hover */}
        <div
          className={cn(
            'pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100',
            accent.ring,
          )}
          aria-hidden
        />
        {/* Faint gravestone arch */}
        <div
          className="pointer-events-none absolute inset-x-6 top-4 bottom-0 rounded-t-[50%_18%] border border-white/[0.04]"
          aria-hidden
        />

        <header className="relative flex items-start justify-between gap-3">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ash">
            🪦 {site.name}
          </span>
          <ParodyTag />
        </header>

        {/* Avatar */}
        <div className="relative mt-4 flex justify-center">
          <CelebrityAvatar
            avatar={celebrity.avatar}
            name={celebrity.name}
            className="h-28 w-28 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Name + title */}
        <div className="relative mt-3 text-center">
          <h3 className="engraved font-display text-xl font-bold tracking-tight text-bone">
            {celebrity.displayName}
          </h3>
          <p className={cn('mt-1 text-xs font-semibold tracking-wide', accent.text)}>
            {celebrity.title}
          </p>
        </div>

        {/* Status */}
        <div className="relative mt-4 rounded-xl border border-moss bg-granite/50 px-3 py-2 text-center">
          <span className="label-caps">Status</span>
          <p className="mt-1 text-sm font-semibold text-bone">{celebrity.status}</p>
        </div>

        {/* Cause of death — the punchline */}
        <div className="relative mt-3 border-y border-moss/70 py-3 text-center">
          <span className="label-caps">Cause of Death</span>
          <p className={cn('mt-1.5 font-display text-base font-bold uppercase leading-tight', accent.text)}>
            {celebrity.causeOfDeath}
          </p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-ash/70">
            Invented for laughs
          </p>
        </div>

        {/* Last words */}
        <div className="relative mt-3 text-center">
          <span className="label-caps">Fictional Last Words</span>
          <p className="mt-1 text-sm italic text-ash">
            &ldquo;{celebrity.lastWords}&rdquo;
          </p>
        </div>

        {/* Achievement + grave number */}
        <footer className="relative mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <span className="label-caps">Achievement</span>
            <p className="mt-1 truncate text-xs font-bold text-legendary">
              {celebrity.achievement}
            </p>
          </div>
          <span className="shrink-0 font-mono text-xs text-ash">
            GRAVE {formatGraveNumber(celebrity.graveNumber)}
          </span>
        </footer>

        <span className="relative mt-4 inline-flex items-center justify-center rounded-xl border border-moss bg-granite/60 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-bone transition-colors group-hover:border-ash/60">
          View Grave →
        </span>
      </article>
    </Link>
  );
}

import { PARODY_DISCLAIMER } from '@/lib/celebrities/data';
import { cn } from '@/lib/utils';

/**
 * The legal notice for the celebrity section.
 *
 * Visible on the graveyard page and on every profile page, as required.
 * Styled to be readable and clearly present without shouting over the joke.
 */
export function ParodyDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'flex items-start gap-3 rounded-xl border border-legendary/25 bg-legendary/[0.06] px-4 py-3',
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 text-sm" aria-hidden>
        ⚠️
      </span>
      <p className="text-[0.7rem] leading-relaxed text-legendary/90 sm:text-xs">
        {PARODY_DISCLAIMER}
      </p>
    </aside>
  );
}

/** The small inline tag printed on every card and profile. */
export function ParodyTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full border border-legendary/40 bg-legendary/10 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-legendary',
        className,
      )}
    >
      Fictional Parody
    </span>
  );
}

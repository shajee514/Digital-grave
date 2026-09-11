import { cn } from '@/lib/utils';

/**
 * Shown wherever a real value is genuinely unknown.
 * We display this instead of inventing an address or a number.
 */
export function ConfigRequired({
  what,
  envVar,
  className,
}: {
  what: string;
  envVar?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex flex-col gap-1 rounded-lg border border-legendary/30 bg-legendary/[0.07] px-3 py-2',
        className,
      )}
    >
      <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-legendary">
        CONFIGURATION REQUIRED
      </span>
      <span className="text-xs text-ash">{what}</span>
      {envVar ? (
        <code className="font-mono text-[0.65rem] text-ash/70">{envVar}</code>
      ) : null}
    </span>
  );
}

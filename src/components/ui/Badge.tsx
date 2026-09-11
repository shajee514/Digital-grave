import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'alive' | 'dead' | 'reborn' | 'legendary' | 'ghost';

const TONES: Record<Tone, string> = {
  neutral: 'border-moss bg-granite/70 text-ash',
  alive: 'border-alive/40 bg-alive/10 text-alive',
  dead: 'border-dead/40 bg-dead/10 text-dead',
  reborn: 'border-reborn/40 bg-reborn/10 text-reborn',
  legendary: 'border-legendary/40 bg-legendary/10 text-legendary',
  ghost: 'border-ghost/40 bg-ghost/10 text-ghost',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Clearly marks anything that is sample data, not real blockchain data. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge tone="legendary" className={cn('shrink-0', className)}>
      <span aria-hidden>🧪</span> DEMO
    </Badge>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CelebrityAvatar } from './CelebrityAvatar';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Celebrity } from '@/lib/celebrities/types';

/**
 * 🎲 RANDOM GRAVE
 *
 * Plays a short "searching the cemetery" animation, reveals a random
 * profile, then offers to open it. Encourages people to keep exploring.
 */
export function RandomGraveButton({
  celebrities,
  className,
}: {
  celebrities: Celebrity[];
  className?: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<'idle' | 'searching' | 'found'>('idle');
  const [pick, setPick] = useState<Celebrity | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Never leave a timer running after the component disappears.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  function roll() {
    if (phase === 'searching' || celebrities.length === 0) return;
    track('celebrity_random');

    const chosen =
      celebrities[Math.floor(Math.random() * celebrities.length)];

    setPhase('searching');
    setPick(null);

    // Flick through faces, then land on the chosen one.
    let ticks = 0;
    const shuffle = setInterval(() => {
      setPick(celebrities[Math.floor(Math.random() * celebrities.length)]);
      ticks += 1;
      if (ticks >= 8) {
        clearInterval(shuffle);
        setPick(chosen);
        setPhase('found');
      }
    }, 130);
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <Button
        variant="reborn"
        size="lg"
        onClick={roll}
        disabled={phase === 'searching'}
        className="w-full sm:w-auto"
      >
        🎲 {phase === 'searching' ? 'DIGGING...' : 'RANDOM GRAVE'}
      </Button>

      {phase !== 'idle' && pick ? (
        <div
          className="stone-panel w-full max-w-sm p-5 text-center"
          role="status"
          aria-live="polite"
        >
          {phase === 'searching' ? (
            <p className="font-mono text-sm text-ash animate-flicker">
              Searching the celebrity cemetery...
            </p>
          ) : (
            <p className="font-display text-sm font-bold tracking-[0.14em] text-reborn">
              🪦 GRAVE FOUND
            </p>
          )}

          <div className="mt-4 flex justify-center">
            <CelebrityAvatar
              avatar={pick.avatar}
              name={pick.name}
              showEmblem={false}
              className={cn(
                'h-24 w-24 transition-all duration-200',
                phase === 'searching' && 'opacity-60 blur-[1px]',
              )}
            />
          </div>

          <p className="mt-3 font-display text-lg font-bold text-bone">
            {phase === 'searching' ? '???' : pick.displayName}
          </p>

          {phase === 'found' ? (
            <>
              <p className="mt-1 text-xs text-ash">{pick.title}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => router.push(`/celebrities/${pick.slug}`)}
              >
                OPEN THIS GRAVE →
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

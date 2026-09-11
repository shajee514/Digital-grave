'use client';

import { useEffect, useState } from 'react';
import { splitDuration } from '@/lib/domain/format';
import { useIsClient } from '@/lib/useIsClient';
import { cn } from '@/lib/utils';

/**
 * Live-ticking survival timer.
 *
 * The starting point comes from the blockchain data. The seconds only tick
 * forward in the browser, so the number stays honest — it is never used to
 * invent history.
 *
 * `initialSeconds` is calculated on the server so the first paint matches
 * exactly what the browser renders, then the browser takes over ticking.
 */
export function SurvivalTimer({
  startedAt,
  initialSeconds,
  className,
  accent = 'alive',
}: {
  /** Unix seconds when the current life began. */
  startedAt: number;
  /** Seconds elapsed, as measured on the server. */
  initialSeconds: number;
  className?: string;
  accent?: 'alive' | 'reborn';
}) {
  const isClient = useIsClient();
  const [liveSeconds, setLiveSeconds] = useState(initialSeconds);

  useEffect(() => {
    // setState only happens inside the interval callback, never directly
    // in the effect body.
    const timer = setInterval(() => {
      setLiveSeconds(Math.max(0, Math.floor(Date.now() / 1000) - startedAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  // Before hydration finishes, always show the server's number.
  const seconds = isClient ? liveSeconds : initialSeconds;
  const { days, hours, minutes, seconds: secs } = splitDuration(seconds);
  const color = accent === 'reborn' ? 'text-reborn' : 'text-alive';

  const units = [
    { key: 'days', value: days, label: days === 1 ? 'DAY' : 'DAYS' },
    { key: 'hours', value: hours, label: hours === 1 ? 'HOUR' : 'HOURS' },
    { key: 'minutes', value: minutes, label: 'MIN' },
    { key: 'seconds', value: secs, label: 'SEC' },
  ];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <span className="label-caps">Survival Timer</span>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.key}
            className="flex flex-col items-center gap-1 rounded-xl border border-moss bg-granite/50 py-3"
          >
            <span
              className={cn(
                'font-mono text-xl font-bold tabular-nums sm:text-2xl',
                color,
                // Only the seconds pulse, and only once the browser is live.
                isClient && unit.key === 'seconds' && 'animate-pulse-glow',
              )}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[0.6rem] font-semibold tracking-[0.14em] text-ash">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

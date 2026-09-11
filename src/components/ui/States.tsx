'use client';

import { useEffect, useState } from 'react';
import { LOADING_MESSAGES } from '@/lib/domain/copy';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/** Rotating, slightly silly loading message. */
export function LoadingMessage({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % LOADING_MESSAGES.length),
      1800,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <p className={cn('font-mono text-sm text-ash animate-flicker', className)}>
      {LOADING_MESSAGES[index]}
    </p>
  );
}

export function EmptyState({
  emoji = '🪦',
  message,
  action,
}: {
  emoji?: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="stone-panel flex flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="text-5xl opacity-70" aria-hidden>
        {emoji}
      </span>
      <p className="max-w-sm text-sm text-ash">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  emoji = '⚠️',
  title,
  message,
  action,
}: {
  emoji?: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="stone-panel flex flex-col items-center gap-3 border-dead/30 px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden>
        {emoji}
      </span>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="max-w-md text-sm text-ash">{message}</p>
      {action}
    </div>
  );
}

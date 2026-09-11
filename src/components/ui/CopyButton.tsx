'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { track, type AnalyticsEvent } from '@/lib/analytics';

export function CopyButton({
  value,
  label = 'COPY',
  copiedLabel = 'COPIED',
  className,
  event,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  event?: AnalyticsEvent;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (event) track(event);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked. Fail quietly rather than showing an error.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-moss bg-granite/60 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:border-ash/60 hover:text-bone',
        copied && 'border-alive/50 text-alive',
        className,
      )}
      aria-live="polite"
    >
      <span aria-hidden>{copied ? '✓' : '⧉'}</span>
      {copied ? copiedLabel : label}
    </button>
  );
}

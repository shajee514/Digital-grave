import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'BUY', emoji: '💸', tone: 'text-alive', note: 'A life begins.' },
  { label: 'HOLD', emoji: '🤲', tone: 'text-alive', note: 'The timer runs.' },
  { label: 'LIVE', emoji: '🟢', tone: 'text-alive', note: 'Levels go up.' },
  { label: 'SELL', emoji: '📉', tone: 'text-dead', note: 'The timer stops.' },
  { label: 'DIE', emoji: '🪦', tone: 'text-dead', note: 'A grave is dug.' },
  { label: 'BUY AGAIN', emoji: '🔁', tone: 'text-reborn', note: 'Try again.' },
  { label: 'RESURRECT', emoji: '⚡', tone: 'text-reborn', note: 'Back from the dead.' },
];

export function LifeCycle() {
  return (
    <ol className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
      {STEPS.map((step, index) => (
        <li
          key={step.label}
          className="stone-panel stone-panel-hover flex min-w-[9.5rem] flex-col items-center gap-2 p-4 text-center sm:min-w-0"
        >
          <span className="text-2xl" aria-hidden>
            {step.emoji}
          </span>
          <span className={cn('font-display text-sm font-bold tracking-[0.08em]', step.tone)}>
            {step.label}
          </span>
          <span className="text-[0.7rem] leading-snug text-ash">{step.note}</span>
          <span className="mt-1 font-mono text-[0.6rem] text-ash/50">
            {String(index + 1).padStart(2, '0')}
          </span>
        </li>
      ))}
    </ol>
  );
}

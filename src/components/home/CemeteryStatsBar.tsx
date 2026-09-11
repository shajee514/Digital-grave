import { formatLifespan } from '@/lib/domain/format';
import type { CemeteryStats } from '@/lib/domain/types';

export function CemeteryStatsBar({ stats }: { stats: CemeteryStats }) {
  const items = [
    { label: 'Graves Dug', value: stats.totalGraves.toLocaleString('en-US'), tone: 'text-dead' },
    { label: 'Still Alive', value: stats.totalLiving.toLocaleString('en-US'), tone: 'text-alive' },
    {
      label: 'Resurrected',
      value: stats.totalResurrected.toLocaleString('en-US'),
      tone: 'text-reborn',
    },
    {
      label: 'Longest Life',
      value: formatLifespan(stats.longestLifeSeconds),
      tone: 'text-legendary',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="stone-panel flex flex-col gap-1.5 p-4 text-center sm:p-5"
        >
          <span className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${item.tone}`}>
            {item.value}
          </span>
          <span className="label-caps">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

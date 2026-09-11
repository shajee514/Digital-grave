import { ACHIEVEMENT_TIER_CLASS } from '@/lib/domain/achievements';
import { formatDate } from '@/lib/domain/format';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/lib/domain/types';

const TIER_EMOJI = { common: '🎖️', rare: '💠', legendary: '👑' } as const;

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {achievements.map((achievement) => {
        const unlocked = achievement.unlockedAt !== null;
        const tier = ACHIEVEMENT_TIER_CLASS[achievement.tier];

        return (
          <div
            key={achievement.id}
            className={cn(
              'flex flex-col gap-2 rounded-xl border p-4 transition-all',
              unlocked
                ? cn(tier.border, tier.bg)
                : 'border-moss/60 bg-granite/20 opacity-45',
            )}
          >
            <span className="text-xl" aria-hidden>
              {unlocked ? TIER_EMOJI[achievement.tier] : '🔒'}
            </span>
            <p
              className={cn(
                'font-display text-sm font-bold tracking-wide',
                unlocked ? tier.text : 'text-ash',
              )}
            >
              {achievement.label}
            </p>
            <p className="text-[0.7rem] leading-snug text-ash">
              {achievement.description}
            </p>
            {unlocked ? (
              <p className="mt-auto pt-1 font-mono text-[0.6rem] text-ash/70">
                {formatDate(achievement.unlockedAt as number)}
              </p>
            ) : (
              <p className="mt-auto pt-1 font-mono text-[0.6rem] text-ash/50">LOCKED</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

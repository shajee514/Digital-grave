import type { Achievement, WalletProfile } from './types';
import { DAY_SECONDS } from './levels';

/**
 * Cosmetic badges. They are bragging rights only and represent
 * no financial value, ownership or entitlement of any kind.
 */

interface AchievementRule {
  key: string;
  label: string;
  description: string;
  tier: 'common' | 'rare' | 'legendary';
  /** Returns the unlock time in unix seconds, or null if not unlocked. */
  test: (p: WalletProfile) => number | null;
}

const RULES: AchievementRule[] = [
  {
    key: 'first-breath',
    label: 'FIRST BREATH',
    description: 'Started your first $RIP life.',
    tier: 'common',
    test: (p) => (p.sessions.length > 0 ? p.sessions[0].startedAt : null),
  },
  {
    key: 'week-one',
    label: 'WEEK ONE',
    description: 'Survived a full 7 days in a single life.',
    tier: 'common',
    test: (p) => {
      const s = p.sessions.find((x) => x.durationSeconds >= 7 * DAY_SECONDS);
      return s ? s.startedAt + 7 * DAY_SECONDS : null;
    },
  },
  {
    key: 'first-death',
    label: 'FIRST BLOOD',
    description: 'Received your very first grave.',
    tier: 'common',
    test: (p) => (p.graves.length > 0 ? p.graves[0].diedAt : null),
  },
  {
    key: 'speedrun',
    label: 'SPEEDRUN',
    description: 'Died in under one hour. Impressive, honestly.',
    tier: 'rare',
    test: (p) => {
      const g = p.graves.find((x) => x.lifespanSeconds < 3600);
      return g ? g.diedAt : null;
    },
  },
  {
    key: 'lazarus',
    label: 'LAZARUS',
    description: 'Came back from the dead at least once.',
    tier: 'rare',
    test: (p) => (p.resurrections > 0 ? (p.lastActivityAt ?? null) : null),
  },
  {
    key: 'nine-lives',
    label: 'NINE LIVES',
    description: 'Lived and died three or more times.',
    tier: 'rare',
    test: (p) => (p.deaths >= 3 ? (p.lastActivityAt ?? null) : null),
  },
  {
    key: 'centurion',
    label: 'CENTURION',
    description: 'Held for 100 days in one unbroken life.',
    tier: 'legendary',
    test: (p) => {
      const s = p.sessions.find((x) => x.durationSeconds >= 100 * DAY_SECONDS);
      return s ? s.startedAt + 100 * DAY_SECONDS : null;
    },
  },
  {
    key: 'undying',
    label: 'UNDYING',
    description: 'Held for a full year without dying.',
    tier: 'legendary',
    test: (p) => {
      const s = p.sessions.find((x) => x.durationSeconds >= 365 * DAY_SECONDS);
      return s ? s.startedAt + 365 * DAY_SECONDS : null;
    },
  },
];

export function computeAchievements(profile: WalletProfile): Achievement[] {
  return RULES.map((rule) => ({
    id: `${profile.address.toLowerCase()}-${rule.key}`,
    key: rule.key,
    label: rule.label,
    description: rule.description,
    tier: rule.tier,
    unlockedAt: rule.test(profile),
  }));
}

export const ACHIEVEMENT_TIER_CLASS: Record<
  Achievement['tier'],
  { text: string; border: string; bg: string }
> = {
  common: { text: 'text-bone', border: 'border-moss', bg: 'bg-granite' },
  rare: { text: 'text-reborn', border: 'border-reborn/40', bg: 'bg-reborn/10' },
  legendary: {
    text: 'text-legendary',
    border: 'border-legendary/40',
    bg: 'bg-legendary/10',
  },
};

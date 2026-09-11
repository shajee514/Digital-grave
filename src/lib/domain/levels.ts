import type { SurvivalLevel } from './types';

export const DAY_SECONDS = 86_400;

interface LevelDefinition {
  level: SurvivalLevel;
  minDays: number;
  maxDays: number | null;
  colorClass: string;
  glowClass: string;
  blurb: string;
}

/** Cosmetic reputation tiers only. They say nothing about money. */
export const SURVIVAL_LEVELS: LevelDefinition[] = [
  {
    level: 'NEWBORN',
    minDays: 0,
    maxDays: 6,
    colorClass: 'text-ash',
    glowClass: '',
    blurb: 'Fresh out of the womb. Statistically doomed.',
  },
  {
    level: 'SURVIVOR',
    minDays: 7,
    maxDays: 29,
    colorClass: 'text-alive',
    glowClass: 'shadow-glow-alive',
    blurb: 'Survived the first week. Most do not.',
  },
  {
    level: 'VETERAN',
    minDays: 30,
    maxDays: 89,
    colorClass: 'text-alive',
    glowClass: 'shadow-glow-alive',
    blurb: 'A full month. The hands are hardening.',
  },
  {
    level: 'DIAMOND HANDS',
    minDays: 90,
    maxDays: 179,
    colorClass: 'text-ghost',
    glowClass: 'shadow-glow-alive',
    blurb: 'Three months. Pressure turned into carbon.',
  },
  {
    level: 'IMMORTAL',
    minDays: 180,
    maxDays: 364,
    colorClass: 'text-legendary',
    glowClass: 'shadow-glow-legendary',
    blurb: 'Half a year. The reaper stopped calling.',
  },
  {
    level: 'UNDYING',
    minDays: 365,
    maxDays: null,
    colorClass: 'text-legendary',
    glowClass: 'shadow-glow-legendary',
    blurb: 'Over a year. Death filed a complaint.',
  },
];

export function levelForSeconds(seconds: number): SurvivalLevel {
  const days = Math.floor(Math.max(0, seconds) / DAY_SECONDS);
  for (let i = SURVIVAL_LEVELS.length - 1; i >= 0; i -= 1) {
    if (days >= SURVIVAL_LEVELS[i].minDays) return SURVIVAL_LEVELS[i].level;
  }
  return 'NEWBORN';
}

export function levelDefinition(level: SurvivalLevel): LevelDefinition {
  return SURVIVAL_LEVELS.find((l) => l.level === level) ?? SURVIVAL_LEVELS[0];
}

/** Progress (0–1) toward the next tier, plus how far away it is. */
export function levelProgress(seconds: number): {
  current: LevelDefinition;
  next: LevelDefinition | null;
  progress: number;
  daysToNext: number | null;
} {
  const days = Math.max(0, seconds) / DAY_SECONDS;
  const index = SURVIVAL_LEVELS.findIndex(
    (l) => days >= l.minDays && (l.maxDays === null || days <= l.maxDays),
  );
  const safeIndex = index === -1 ? 0 : index;
  const current = SURVIVAL_LEVELS[safeIndex];
  const next = SURVIVAL_LEVELS[safeIndex + 1] ?? null;

  if (!next) return { current, next: null, progress: 1, daysToNext: null };

  const span = next.minDays - current.minDays;
  const progress = span > 0 ? Math.min(1, (days - current.minDays) / span) : 1;
  return {
    current,
    next,
    progress,
    daysToNext: Math.max(0, Math.ceil(next.minDays - days)),
  };
}

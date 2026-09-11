import { CELEBRITIES } from './data';
import type { Celebrity, CelebrityFilter } from './types';

/**
 * Read access to the celebrity roster.
 *
 * Mirrors the shape of the wallet `dataSource` so that when the database
 * arrives, these functions can be swapped to async database queries
 * without any page having to change.
 */

export interface CelebrityFilterOption {
  key: CelebrityFilter;
  label: string;
}

export const CELEBRITY_FILTERS: CelebrityFilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'business', label: 'Business' },
  { key: 'politics', label: 'Politics' },
  { key: 'legends', label: 'Legends' },
  { key: 'immortals', label: 'Immortals' },
  { key: 'dead', label: 'Dead' },
  { key: 'alive', label: 'Alive' },
  { key: 'undead', label: 'Undead' },
];

/** Every profile, in grave-number order. */
export function getAllCelebrities(): Celebrity[] {
  return [...CELEBRITIES].sort((a, b) => a.graveNumber - b.graveNumber);
}

export function getCelebrityBySlug(slug: string): Celebrity | null {
  const clean = (slug ?? '').trim().toLowerCase();
  return CELEBRITIES.find((c) => c.slug === clean) ?? null;
}

export function getFeaturedCelebrities(limit = 3): Celebrity[] {
  const featured = CELEBRITIES.filter((c) => c.featured);
  const pool = featured.length >= limit ? featured : getAllCelebrities();
  return pool.slice(0, limit);
}

/** True when a profile counts as "immortal" for the filters. */
function isImmortal(celebrity: Celebrity): boolean {
  return (
    celebrity.graveStatus === 'IMMORTAL' ||
    celebrity.achievement.toUpperCase().includes('IMMORTAL')
  );
}

export function matchesFilter(
  celebrity: Celebrity,
  filter: CelebrityFilter,
): boolean {
  switch (filter) {
    case 'crypto':
    case 'business':
    case 'politics':
    case 'legends':
      return celebrity.category === (filter.toUpperCase() as Celebrity['category']);
    case 'immortals':
      return isImmortal(celebrity);
    case 'dead':
      return celebrity.graveStatus === 'DEAD';
    case 'alive':
      return celebrity.graveStatus === 'ALIVE';
    case 'undead':
      return celebrity.graveStatus === 'UNDEAD';
    case 'all':
    default:
      return true;
  }
}

/** Simple, forgiving name search across the roster. */
export function matchesQuery(celebrity: Celebrity, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    celebrity.name,
    celebrity.displayName,
    celebrity.title,
    celebrity.achievement,
    celebrity.causeOfDeath,
    ...celebrity.searchTerms,
  ]
    .join(' ')
    .toLowerCase();

  // Every word typed must appear somewhere.
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function searchCelebrities(
  query: string,
  filter: CelebrityFilter = 'all',
): Celebrity[] {
  return getAllCelebrities().filter(
    (c) => matchesFilter(c, filter) && matchesQuery(c, query),
  );
}

/** Picks a random profile. Optionally avoids repeating the current one. */
export function randomCelebrity(excludeSlug?: string): Celebrity {
  const all = getAllCelebrities();
  const pool =
    excludeSlug && all.length > 1
      ? all.filter((c) => c.slug !== excludeSlug)
      : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------------------------------------------------------------------------
// Meme leaderboard — fictional entertainment data only.
// ---------------------------------------------------------------------------

export type CelebrityBoard =
  | 'most-immortal'
  | 'most-resurrected'
  | 'longest-life'
  | 'funniest-grave'
  | 'most-legendary';

export interface CelebrityBoardOption {
  key: CelebrityBoard;
  label: string;
  blurb: string;
}

export const CELEBRITY_BOARDS: CelebrityBoardOption[] = [
  {
    key: 'most-immortal',
    label: 'Most Immortal',
    blurb: 'Refuses to be buried, no matter how hard the cemetery tries.',
  },
  {
    key: 'most-resurrected',
    label: 'Most Resurrected',
    blurb: 'Keeps climbing back out of the hole.',
  },
  {
    key: 'longest-life',
    label: 'Longest Life',
    blurb: 'Has been avoiding the gravedigger the longest.',
  },
  {
    key: 'funniest-grave',
    label: 'Funniest Grave',
    blurb: 'The cause of death that gets the biggest laugh.',
  },
  {
    key: 'most-legendary',
    label: 'Most Legendary',
    blurb: 'The names whispered around the cemetery campfire.',
  },
];

export interface CelebrityBoardRow {
  rank: number;
  celebrity: Celebrity;
  value: string;
}

export function getCelebrityBoard(board: CelebrityBoard): CelebrityBoardRow[] {
  const all = getAllCelebrities();

  const ranked = (() => {
    switch (board) {
      case 'most-resurrected':
        return [...all]
          .sort((a, b) => b.stats.resurrections - a.stats.resurrections)
          .map((c) => ({
            celebrity: c,
            value: `${c.stats.resurrections} ${
              c.stats.resurrections === 1 ? 'comeback' : 'comebacks'
            }`,
          }));
      case 'longest-life':
        return [...all]
          .sort((a, b) => b.stats.immortality - a.stats.immortality)
          .map((c) => ({ celebrity: c, value: c.stats.longestLife }));
      case 'funniest-grave':
        return [...all]
          .sort((a, b) => b.stats.comedy - a.stats.comedy)
          .map((c) => ({ celebrity: c, value: c.causeOfDeath }));
      case 'most-legendary':
        return [...all]
          .sort((a, b) => b.stats.legend - a.stats.legend)
          .map((c) => ({ celebrity: c, value: `${c.stats.legend} legend` }));
      case 'most-immortal':
      default:
        return [...all]
          .sort((a, b) => b.stats.immortality - a.stats.immortality)
          .map((c) => ({
            celebrity: c,
            value: `${c.stats.immortality}% immortal`,
          }));
    }
  })();

  return ranked.map((row, index) => ({ ...row, rank: index + 1 }));
}

// ---------------------------------------------------------------------------
// Share text
// ---------------------------------------------------------------------------

/**
 * Builds the share text. The FICTIONAL PARODY line is part of the text
 * itself, so the joke cannot travel to social media without its label.
 */
export function celebrityShareText(celebrity: Celebrity): string {
  return [
    `🪦 ${celebrity.displayName} HAS ENTERED THE DIGITAL GRAVEYARD 💀`,
    '',
    'Cause of Death:',
    celebrity.causeOfDeath,
    '',
    'Achievement:',
    celebrity.achievement,
    '',
    'DIGITAL GRAVE $RIP',
    '',
    'FICTIONAL PARODY',
  ].join('\n');
}

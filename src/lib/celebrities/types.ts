/**
 * CELEBRITY GRAVEYARD — types.
 *
 * Everything in this section is FICTIONAL PARODY CONTENT.
 *
 * Hard content rules enforced by this shape:
 *  - There is no field for a wallet address, balance or token holding.
 *    The data model itself makes it impossible to claim that a public
 *    figure bought, owns, holds or supports $RIP.
 *  - `parodyOnly` is required and must be true. Nothing can be published
 *    in this section without being marked as parody.
 *  - `causeOfDeath` and `lastWords` are invented jokes, never real quotes
 *    or real events, and the interface always labels them as such.
 */

/** Meme categories. These describe the joke, not the real person. */
export type CelebrityCategory = 'CRYPTO' | 'BUSINESS' | 'POLITICS' | 'LEGENDS';

/**
 * Meme grave status. This is a joke about the cemetery only.
 * It never describes anyone's real-world condition — everyone featured
 * here is treated as a living public figure being gently teased.
 */
export type CelebrityGraveStatus = 'ALIVE' | 'DEAD' | 'UNDEAD' | 'IMMORTAL';

export type CelebrityFilter =
  | 'all'
  | 'crypto'
  | 'business'
  | 'politics'
  | 'legends'
  | 'immortals'
  | 'dead'
  | 'alive'
  | 'undead';

/** Drawing instructions for the original cartoon avatar. */
export interface CelebrityAvatar {
  hair:
    | 'swoop'
    | 'sweep'
    | 'crop'
    | 'hood'
    | 'bowl'
    | 'slick'
    | 'curls'
    | 'flat';
  hairColor: string;
  skin: string;
  accessory: 'none' | 'glasses' | 'shades' | 'cap' | 'tie' | 'question';
  accent: 'alive' | 'dead' | 'reborn' | 'legendary' | 'ghost';
  /** A single emoji shown as a badge on the avatar. */
  emblem: string;
}

/** Fictional entertainment scores, used only for the meme leaderboard. */
export interface CelebrityStats {
  immortality: number;
  resurrections: number;
  /** A joke lifespan, written as text (e.g. "Since the Big Bang"). */
  longestLife: string;
  /** Used to rank the "funniest grave". */
  comedy: number;
  legend: number;
}

export interface Celebrity {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  category: CelebrityCategory;
  /** Meme title, e.g. "🚀 THE DOGE IMMORTAL". */
  title: string;
  /** Meme grave status label, e.g. "💀 SOMEHOW STILL ALIVE". */
  status: string;
  graveStatus: CelebrityGraveStatus;
  /** An obviously silly, invented cause. Never a real event. */
  causeOfDeath: string;
  /** Invented parody words. Never presented as a real quote. */
  lastWords: string;
  achievement: string;
  graveNumber: number;
  /** Short, obviously fictional meme biography. */
  description: string[];
  avatar: CelebrityAvatar;
  stats: CelebrityStats;
  featured: boolean;
  /** Always true. Nothing may be published here without it. */
  parodyOnly: true;
  createdAt: string;
  /** Extra words that should match this profile in search. */
  searchTerms: string[];
}

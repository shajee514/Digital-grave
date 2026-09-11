import type { WalletState } from './types';

/**
 * All wording for the four wallet states lives here.
 *
 * Every line is written to describe what the data actually shows and
 * nothing more. We never claim a wallet holds tokens, made a profit, or
 * had a particular intention.
 */

export interface StateCopy {
  emoji: string;
  headline: string;
  /** The honest, plain-language explanation. Always shown. */
  explanation: string;
  lines: string[];
  accent: 'alive' | 'dead' | 'reborn' | 'ghost';
  textClass: string;
  borderClass: string;
  bgClass: string;
  glowClass: string;
  dotClass: string;
}

export const STATE_COPY: Record<WalletState, StateCopy> = {
  NEVER: {
    emoji: '👻',
    headline: 'NOT YET DEAD',
    explanation:
      "👻 We couldn't find any $RIP activity for this wallet.",
    lines: [
      "The cemetery doesn't know you yet.",
      "You haven't started your $RIP story.",
      '🪦 Your grave is still available.',
    ],
    accent: 'ghost',
    textClass: 'text-ghost',
    borderClass: 'border-ghost/30',
    bgClass: 'bg-ghost/5',
    glowClass: '',
    dotClass: 'bg-ghost',
  },
  ALIVE: {
    emoji: '🟢',
    headline: 'ALIVE',
    explanation: '🟢 This wallet currently holds $RIP.',
    lines: ['Still alive. Still holding.'],
    accent: 'alive',
    textClass: 'text-alive',
    borderClass: 'border-alive/30',
    bgClass: 'bg-alive/5',
    glowClass: 'shadow-glow-alive',
    dotClass: 'bg-alive',
  },
  DEAD: {
    emoji: '🪦',
    headline: 'DEAD',
    explanation:
      '🪦 This wallet previously held $RIP but currently has no qualifying position.',
    lines: ['Everyone dies. Paper hands die first.'],
    accent: 'dead',
    textClass: 'text-dead',
    borderClass: 'border-dead/30',
    bgClass: 'bg-dead/5',
    glowClass: 'shadow-glow-dead',
    dotClass: 'bg-dead',
  },
  RESURRECTED: {
    emoji: '⚡',
    headline: 'RESURRECTED',
    explanation: '⚡ This wallet sold before and later returned.',
    lines: ['He came back from the dead.'],
    accent: 'reborn',
    textClass: 'text-reborn',
    borderClass: 'border-reborn/30',
    bgClass: 'bg-reborn/5',
    glowClass: 'shadow-glow-reborn',
    dotClass: 'bg-reborn',
  },
};

/** Fun loading messages, shown while data is being fetched. */
export const LOADING_MESSAGES = [
  'Searching the cemetery...',
  'Digging through the blockchain...',
  'Finding your grave...',
  "Checking if you're still alive...",
  'Consulting the tombstones...',
  'Waking the gravekeeper...',
];

export const EMPTY_STATES = {
  graveyard: 'The cemetery is still waiting for its first victim.',
  living: 'No survivors yet.',
  resurrected: 'Nobody has risen from the dead yet.',
  leaderboard: 'No records carved yet.',
  transactions: 'No $RIP transactions recorded for this wallet.',
} as const;

export const ERROR_MESSAGES = {
  invalidAddress: "That's not a valid wallet address.",
  noHistory: 'No $RIP history found.',
  indexerDown: 'The cemetery database is temporarily updating.',
  rpcDown: 'Blockchain connection temporarily unavailable.',
  notFound: 'That page has already been buried.',
  generic: 'Something went wrong. The gravekeeper has been notified.',
} as const;

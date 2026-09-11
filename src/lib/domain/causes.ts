import type { CauseOfDeath } from './types';

const HOUR = 3600;
const DAY = 86_400;

export const ALL_CAUSES: CauseOfDeath[] = [
  'PANIC SELL',
  'PAPER HANDS',
  'SOLD THE DIP',
  'TOO EARLY',
  'NO PATIENCE',
  'WEAK HANDS',
  'TAKE PROFIT',
  'RUGGED BY MYSELF',
  "COULDN'T HOLD",
  'FOMO OUT',
];

/**
 * Causes that are considered extra funny, used by the "Funniest Causes"
 * filter in the graveyard.
 */
export const FUNNIEST_CAUSES: CauseOfDeath[] = [
  'RUGGED BY MYSELF',
  'FOMO OUT',
  'PANIC SELL',
  "COULDN'T HOLD",
];

/**
 * A small, stable string hash. Same input always gives the same number,
 * on the server and in the browser.
 */
function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

/**
 * Which causes are plausible for a given lifespan.
 * These are jokes about how long someone held — never claims about
 * what actually happened in a transaction.
 */
function eligibleCauses(lifespanSeconds: number): CauseOfDeath[] {
  if (lifespanSeconds < HOUR) {
    return ['PANIC SELL', 'NO PATIENCE', 'FOMO OUT'];
  }
  if (lifespanSeconds < DAY) {
    return ['PANIC SELL', 'PAPER HANDS', 'NO PATIENCE', "COULDN'T HOLD"];
  }
  if (lifespanSeconds < 3 * DAY) {
    return ['PAPER HANDS', 'WEAK HANDS', 'SOLD THE DIP', "COULDN'T HOLD"];
  }
  if (lifespanSeconds < 7 * DAY) {
    return ['WEAK HANDS', 'SOLD THE DIP', 'TOO EARLY', 'RUGGED BY MYSELF'];
  }
  if (lifespanSeconds < 30 * DAY) {
    return ['TOO EARLY', 'TAKE PROFIT', 'SOLD THE DIP', 'RUGGED BY MYSELF'];
  }
  return ['TAKE PROFIT', 'TOO EARLY', 'RUGGED BY MYSELF'];
}

/**
 * Picks a cause of death.
 *
 * Deterministic: the same grave always produces the same cause, forever.
 * It is derived from how long the wallet held plus a stable hash of the
 * wallet address and grave number — never from guessing what the trader
 * was thinking.
 */
export function causeOfDeathFor(
  walletAddress: string,
  graveNumber: number,
  lifespanSeconds: number,
): CauseOfDeath {
  const options = eligibleCauses(lifespanSeconds);
  const seed = stableHash(`${walletAddress.toLowerCase()}:${graveNumber}`);
  return options[seed % options.length];
}

/** A short, clearly-jokey line shown under the cause on a grave card. */
export function causeFlavour(cause: CauseOfDeath): string {
  const lines: Record<CauseOfDeath, string> = {
    'PANIC SELL': 'The chart moved. So did they.',
    'PAPER HANDS': 'Hands made of receipts.',
    'SOLD THE DIP': 'Bought high. Sold lower. Classic.',
    'TOO EARLY': 'Left the party before the music started.',
    'NO PATIENCE': 'Attention span of a candle wick.',
    'WEAK HANDS': 'Grip strength: zero.',
    'TAKE PROFIT': 'Responsible. Boring. Still dead.',
    'RUGGED BY MYSELF': 'No villain required.',
    "COULDN'T HOLD": 'The spirit was willing. The finger was not.',
    'FOMO OUT': 'Ran toward the next shiny thing.',
  };
  return lines[cause];
}

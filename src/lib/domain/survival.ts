import type {
  Grave,
  RipTransaction,
  SurvivalSession,
  WalletProfile,
  WalletState,
} from './types';
import { causeOfDeathFor } from './causes';
import { levelForSeconds } from './levels';

/**
 * THE SURVIVAL ENGINE
 *
 * Turns a list of $RIP transactions into lives, deaths and graves.
 * This same function is used by the website today and by the indexer later,
 * so the numbers can never disagree between them.
 *
 * Key rules:
 *  - A life STARTS when a wallet goes from holding nothing to holding $RIP.
 *  - A life ENDS when the balance returns to zero.
 *  - A GRAVE is only issued when the life ended with a SELL.
 *    Moving tokens to another wallet is not dying, so it makes no grave.
 *  - Nothing is guessed from the current balance alone.
 */

/**
 * Balances below this are treated as dust, not a real position.
 * Stops rounding leftovers from keeping a wallet "alive" forever.
 */
export const QUALIFYING_MIN_BALANCE = 1e-9;

const INCOMING = new Set(['BUY', 'TRANSFER_IN']);

export interface BuiltHistory {
  sessions: SurvivalSession[];
  currentBalance: number;
  firstSeenAt: number | null;
  lastActivityAt: number | null;
}

/** Replays a wallet's transactions in order and rebuilds every life. */
export function buildSessions(
  walletAddress: string,
  transactions: RipTransaction[],
  now: number = Math.floor(Date.now() / 1000),
): BuiltHistory {
  const ordered = [...transactions].sort((a, b) => {
    if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
    return a.blockNumber - b.blockNumber;
  });

  const sessions: SurvivalSession[] = [];
  let balance = 0;
  let lifeNumber = 0;
  let openedAt: number | null = null;
  let peak = 0;

  for (const tx of ordered) {
    const delta = INCOMING.has(tx.transactionType) ? tx.amount : -tx.amount;
    const before = balance;
    balance = Math.max(0, balance + delta);

    const wasAlive = before > QUALIFYING_MIN_BALANCE;
    const isAlive = balance > QUALIFYING_MIN_BALANCE;

    if (!wasAlive && isAlive) {
      // A new life begins.
      lifeNumber += 1;
      openedAt = tx.timestamp;
      peak = balance;
    } else if (isAlive) {
      peak = Math.max(peak, balance);
    }

    if (wasAlive && !isAlive && openedAt !== null) {
      // This life just ended. How it ended decides whether a grave is made.
      const endedBy = tx.transactionType === 'SELL' ? 'SELL' : 'TRANSFER_OUT';
      sessions.push({
        id: `${walletAddress.toLowerCase()}-life-${lifeNumber}`,
        walletAddress,
        lifeNumber,
        startedAt: openedAt,
        endedAt: tx.timestamp,
        durationSeconds: Math.max(0, tx.timestamp - openedAt),
        peakBalance: peak,
        isActive: false,
        endedBy,
      });
      openedAt = null;
      peak = 0;
    }
  }

  // Still holding? Then the final life is still running.
  if (openedAt !== null && balance > QUALIFYING_MIN_BALANCE) {
    sessions.push({
      id: `${walletAddress.toLowerCase()}-life-${lifeNumber}`,
      walletAddress,
      lifeNumber,
      startedAt: openedAt,
      endedAt: null,
      durationSeconds: Math.max(0, now - openedAt),
      peakBalance: peak,
      isActive: true,
      endedBy: null,
    });
  }

  return {
    sessions,
    currentBalance: balance,
    firstSeenAt: ordered.length > 0 ? ordered[0].timestamp : null,
    lastActivityAt:
      ordered.length > 0 ? ordered[ordered.length - 1].timestamp : null,
  };
}

/**
 * Creates a grave for every life that ended in a sale.
 * `graveNumberFor` lets the caller supply the real sequential number from
 * the database; in demo mode a deterministic stand-in is used.
 */
export function buildGraves(
  walletAddress: string,
  sessions: SurvivalSession[],
  graveNumberFor: (session: SurvivalSession, index: number) => number,
): Grave[] {
  const deadly = sessions.filter((s) => !s.isActive && s.endedBy === 'SELL');

  return deadly.map((session, index) => {
    const graveNumber = graveNumberFor(session, index);
    const laterLifeExists = sessions.some(
      (s) => s.lifeNumber > session.lifeNumber,
    );
    return {
      id: `${walletAddress.toLowerCase()}-grave-${graveNumber}`,
      graveNumber,
      walletAddress,
      bornAt: session.startedAt,
      diedAt: session.endedAt ?? session.startedAt,
      lifespanSeconds: session.durationSeconds,
      causeOfDeath: causeOfDeathFor(
        walletAddress,
        graveNumber,
        session.durationSeconds,
      ),
      status: laterLifeExists ? 'RESURRECTED' : 'BURIED',
      resurrectionNumber: index,
      createdAt: session.endedAt ?? session.startedAt,
    };
  });
}

/**
 * Decides which of the four states a wallet is in.
 *
 * NEVER        -> no $RIP activity has ever been recorded
 * ALIVE        -> holding right now, has never died
 * RESURRECTED  -> holding right now, but has died at least once before
 * DEAD         -> has held before, holds nothing now
 */
export function deriveState(
  transactionCount: number,
  currentBalance: number,
  deaths: number,
): WalletState {
  if (transactionCount === 0) return 'NEVER';
  const holding = currentBalance > QUALIFYING_MIN_BALANCE;
  if (holding) return deaths > 0 ? 'RESURRECTED' : 'ALIVE';
  return 'DEAD';
}

/** Assembles a complete, ready-to-render wallet profile. */
export function buildProfile(
  address: string,
  transactions: RipTransaction[],
  options: {
    isDemo?: boolean;
    now?: number;
    graveNumberFor?: (session: SurvivalSession, index: number) => number;
  } = {},
): WalletProfile {
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const { sessions, currentBalance, firstSeenAt, lastActivityAt } =
    buildSessions(address, transactions, now);

  const graves = buildGraves(
    address,
    sessions,
    options.graveNumberFor ?? ((session) => session.lifeNumber),
  );

  const deaths = graves.length;
  const active = sessions.find((s) => s.isActive) ?? null;
  const state = deriveState(transactions.length, currentBalance, deaths);

  /**
   * A resurrection is a life that began AFTER the wallet had already died
   * at least once. Counting it this way means a wallet that simply moved
   * its tokens and came back is not credited with rising from the dead.
   */
  const deathTimes = graves.map((g) => g.diedAt);
  const resurrections = sessions.filter((s) =>
    deathTimes.some((t) => t <= s.startedAt),
  ).length;

  const longestLifeSeconds = sessions.reduce(
    (max, s) => Math.max(max, s.durationSeconds),
    0,
  );
  const totalLifetimeSeconds = sessions.reduce(
    (sum, s) => sum + s.durationSeconds,
    0,
  );

  return {
    address,
    state,
    isDemo: options.isDemo ?? false,
    currentBalance,
    currentLifeSeconds: active ? active.durationSeconds : 0,
    currentLifeStartedAt: active ? active.startedAt : null,
    survivalLevel: active ? levelForSeconds(active.durationSeconds) : null,
    totalLives: sessions.length,
    deaths,
    resurrections,
    longestLifeSeconds,
    totalLifetimeSeconds,
    firstSeenAt,
    lastActivityAt,
    transactions: [...transactions].sort((a, b) => b.timestamp - a.timestamp),
    sessions,
    graves,
    achievements: [],
  };
}

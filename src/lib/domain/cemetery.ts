import type {
  CemeteryStats,
  Grave,
  GraveyardEntry,
  LivingEntry,
  ResurrectedEntry,
  RipTransaction,
  SurvivalSession,
  WalletProfile,
} from './types';
import { buildSessions, deriveState } from './survival';
import { causeOfDeathFor } from './causes';
import { levelForSeconds } from './levels';
import { computeAchievements } from './achievements';

/**
 * BUILDS A WHOLE CEMETERY from per-wallet transaction lists.
 *
 * This is the single place where lives, graves, grave numbers and the
 * public listings are assembled. Demo mode and live blockchain mode both
 * run through this exact code, so the two can never disagree about how a
 * grave is numbered or when a wallet counts as dead.
 */

export interface Cemetery {
  profiles: Map<string, WalletProfile>;
  graves: GraveyardEntry[];
  living: LivingEntry[];
  resurrected: ResurrectedEntry[];
  stats: CemeteryStats;
  generatedAt: number;
}

export interface BuildCemeteryOptions {
  /** Unix seconds to treat as "now". */
  now?: number;
  /** Marks everything produced as sample data. */
  isDemo?: boolean;
  /**
   * Grave numbers start at this value plus one. Demo data uses an offset so
   * the numbers look lived-in; real data starts at #000001.
   */
  graveNumberBase?: number;
}

export function buildCemetery(
  transactionsByWallet: Map<string, RipTransaction[]>,
  options: BuildCemeteryOptions = {},
): Cemetery {
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const isDemo = options.isDemo ?? false;
  const graveNumberBase = options.graveNumberBase ?? 0;

  // Pass 1 — rebuild every wallet's lives from its transactions.
  const built = [...transactionsByWallet.entries()].map(([address, txs]) => ({
    address,
    transactions: txs,
    history: buildSessions(address, txs, now),
  }));

  // Pass 2 — number the graves globally, oldest death first, so grave
  // numbers reflect the real order in which wallets died.
  const deadSessions: { address: string; session: SurvivalSession }[] = [];
  for (const entry of built) {
    for (const session of entry.history.sessions) {
      if (!session.isActive && session.endedBy === 'SELL') {
        deadSessions.push({ address: entry.address, session });
      }
    }
  }
  deadSessions.sort(
    (a, b) =>
      (a.session.endedAt ?? 0) - (b.session.endedAt ?? 0) ||
      a.address.localeCompare(b.address),
  );

  const graveNumbers = new Map<string, number>();
  deadSessions.forEach((entry, i) => {
    graveNumbers.set(entry.session.id, graveNumberBase + i + 1);
  });

  // Pass 3 — assemble the profiles and the public listings.
  const profiles = new Map<string, WalletProfile>();
  const allGraves: GraveyardEntry[] = [];
  const living: LivingEntry[] = [];
  const resurrected: ResurrectedEntry[] = [];

  for (const { address, transactions, history } of built) {
    const { sessions, currentBalance, firstSeenAt, lastActivityAt } = history;

    const graves: Grave[] = sessions
      .filter((s) => !s.isActive && s.endedBy === 'SELL')
      .map((session, index) => {
        const graveNumber = graveNumbers.get(session.id) ?? index + 1;
        const laterLife = sessions.some((s) => s.lifeNumber > session.lifeNumber);
        return {
          id: `${address.toLowerCase()}-grave-${graveNumber}`,
          graveNumber,
          walletAddress: address,
          bornAt: session.startedAt,
          diedAt: session.endedAt ?? session.startedAt,
          lifespanSeconds: session.durationSeconds,
          causeOfDeath: causeOfDeathFor(
            address,
            graveNumber,
            session.durationSeconds,
          ),
          status: laterLife ? 'RESURRECTED' : 'BURIED',
          resurrectionNumber: index,
          createdAt: session.endedAt ?? session.startedAt,
        } satisfies Grave;
      });

    const deaths = graves.length;
    const active = sessions.find((s) => s.isActive) ?? null;
    const state = deriveState(transactions.length, currentBalance, deaths);

    /**
     * A resurrection is a life that began after the wallet had ALREADY died.
     * This walks the lives in order rather than comparing timestamps, because
     * a wallet that buys and sells inside a single block has a life whose
     * start, end and death time are all identical.
     */
    let hasDied = false;
    let resurrectionCount = 0;
    for (const session of sessions) {
      if (hasDied) resurrectionCount += 1;
      if (!session.isActive && session.endedBy === 'SELL') hasDied = true;
    }

    const profile: WalletProfile = {
      address,
      state,
      isDemo,
      currentBalance,
      currentLifeSeconds: active ? active.durationSeconds : 0,
      currentLifeStartedAt: active ? active.startedAt : null,
      survivalLevel: active ? levelForSeconds(active.durationSeconds) : null,
      totalLives: sessions.length,
      deaths,
      resurrections: resurrectionCount,
      longestLifeSeconds: sessions.reduce(
        (max, s) => Math.max(max, s.durationSeconds),
        0,
      ),
      totalLifetimeSeconds: sessions.reduce(
        (sum, s) => sum + s.durationSeconds,
        0,
      ),
      firstSeenAt,
      lastActivityAt,
      transactions: [...transactions].sort((a, b) => b.timestamp - a.timestamp),
      sessions,
      graves,
      achievements: [],
    };
    profile.achievements = computeAchievements(profile);
    profiles.set(address.toLowerCase(), profile);

    for (const grave of graves) {
      allGraves.push({ ...grave, totalDeathsForWallet: deaths, isDemo });
    }

    if (active) {
      living.push({
        address,
        balance: currentBalance,
        holdingSeconds: active.durationSeconds,
        level: levelForSeconds(active.durationSeconds),
        transactionCount: transactions.length,
        isDemo,
      });
    }

    if (resurrectionCount > 0) {
      resurrected.push({
        address,
        deaths,
        resurrections: resurrectionCount,
        currentState: state,
        longestLifeSeconds: profile.longestLifeSeconds,
        totalLifetimeSeconds: profile.totalLifetimeSeconds,
        isDemo,
      });
    }
  }

  allGraves.sort((a, b) => b.diedAt - a.diedAt);

  const longestLifeSeconds = [...profiles.values()].reduce(
    (max, p) => Math.max(max, p.longestLifeSeconds),
    0,
  );

  return {
    profiles,
    graves: allGraves,
    living,
    resurrected,
    stats: {
      totalGraves: allGraves.length,
      totalLiving: living.length,
      totalResurrected: resurrected.length,
      longestLifeSeconds,
      isDemo,
    },
    generatedAt: now,
  };
}

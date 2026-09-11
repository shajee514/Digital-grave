import type { DataSource, Page } from './types';
import type {
  CemeteryStats,
  GraveyardEntry,
  GraveyardFilter,
  LeaderboardRow,
  LeaderboardSection,
  LivingEntry,
  LivingSort,
  WalletProfile,
} from '../domain/types';
import { buildCemetery, type Cemetery } from '../domain/cemetery';
import { scanChain } from '../chain/scanner';
import { serverEnv } from '../config/env';
import { FUNNIEST_CAUSES } from '../domain/causes';
import { SURVIVAL_LEVELS } from '../domain/levels';
import { compactAmount, formatLifespan } from '../domain/format';
import { validateAddress } from '../utils';
import { NotConfiguredError } from './errors';

/**
 * LIVE DATA SOURCE — reads real $RIP activity from Robinhood Chain.
 *
 * It reads the token's Transfer history over RPC and rebuilds the cemetery
 * using exactly the same engine demo mode uses. No database is required,
 * which means the site works the moment a token address and an RPC URL are
 * configured.
 *
 * A scan is cached briefly so a burst of visitors does not hammer the RPC.
 * For a token with a very long history this will hit its safety limits, at
 * which point a proper indexer (Phase 4) becomes worthwhile — the site says
 * so honestly rather than showing partial numbers as if they were complete.
 */

interface CacheEntry {
  cemetery: Cemetery;
  truncated: boolean;
  logCount: number;
  at: number;
}

let cache: CacheEntry | null = null;
let inFlight: Promise<CacheEntry> | null = null;

async function loadCemetery(): Promise<CacheEntry> {
  const now = Date.now();

  if (cache && now - cache.at < serverEnv.cacheTtlSeconds * 1000) {
    return cache;
  }

  // If a scan is already running, wait for it instead of starting a second.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const scan = await scanChain();
    const cemetery = buildCemetery(scan.transactionsByWallet, {
      isDemo: false,
      graveNumberBase: 0,
    });
    const entry: CacheEntry = {
      cemetery,
      truncated: scan.truncated,
      logCount: scan.logCount,
      at: Date.now(),
    };
    cache = entry;
    return entry;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

/** Forces the next request to re-read the chain. */
export function invalidateLiveCache(): void {
  cache = null;
}

/** Diagnostics for the admin page. */
export async function liveScanStatus(): Promise<{
  wallets: number;
  graves: number;
  living: number;
  logCount: number;
  truncated: boolean;
  scannedAt: number;
}> {
  const entry = await loadCemetery();
  return {
    wallets: entry.cemetery.profiles.size,
    graves: entry.cemetery.graves.length,
    living: entry.cemetery.living.length,
    logCount: entry.logCount,
    truncated: entry.truncated,
    scannedAt: entry.cemetery.generatedAt,
  };
}

function paginate<T>(items: T[], limit = 24, offset = 0): Page<T> {
  return { items: items.slice(offset, offset + limit), total: items.length };
}

function sortGraves(
  graves: GraveyardEntry[],
  filter: GraveyardFilter,
): GraveyardEntry[] {
  const copy = [...graves];
  switch (filter) {
    case 'recent':
      return copy.sort((a, b) => b.diedAt - a.diedAt);
    case 'longest':
      return copy.sort((a, b) => b.lifespanSeconds - a.lifespanSeconds);
    case 'shortest':
      return copy.sort((a, b) => a.lifespanSeconds - b.lifespanSeconds);
    case 'most-deaths':
      return copy.sort(
        (a, b) =>
          b.totalDeathsForWallet - a.totalDeathsForWallet || b.diedAt - a.diedAt,
      );
    case 'funniest':
      return copy
        .filter((g) => FUNNIEST_CAUSES.includes(g.causeOfDeath))
        .sort((a, b) => a.lifespanSeconds - b.lifespanSeconds);
    case 'all':
    default:
      return copy.sort((a, b) => b.graveNumber - a.graveNumber);
  }
}

function sortLiving(entries: LivingEntry[], sort: LivingSort): LivingEntry[] {
  const copy = [...entries];
  switch (sort) {
    case 'largest-holder':
      return copy.sort((a, b) => b.balance - a.balance);
    case 'most-transactions':
      return copy.sort((a, b) => b.transactionCount - a.transactionCount);
    case 'highest-level': {
      const rank = (level: LivingEntry['level']) =>
        SURVIVAL_LEVELS.findIndex((l) => l.level === level);
      return copy.sort(
        (a, b) =>
          rank(b.level) - rank(a.level) || b.holdingSeconds - a.holdingSeconds,
      );
    }
    case 'longest-survival':
    default:
      return copy.sort((a, b) => b.holdingSeconds - a.holdingSeconds);
  }
}

export const liveDataSource: DataSource = {
  mode: 'live',

  async getWalletProfile(address: string): Promise<WalletProfile | null> {
    const { valid, address: checksummed } = validateAddress(address);
    if (!valid || !checksummed) return null;
    const { cemetery } = await loadCemetery();
    return cemetery.profiles.get(checksummed.toLowerCase()) ?? null;
  },

  async getGraves({ filter = 'all', limit = 24, offset = 0 }) {
    const { cemetery } = await loadCemetery();
    return paginate(sortGraves(cemetery.graves, filter), limit, offset);
  },

  async getGraveByNumber(graveNumber: number): Promise<GraveyardEntry | null> {
    const { cemetery } = await loadCemetery();
    return cemetery.graves.find((g) => g.graveNumber === graveNumber) ?? null;
  },

  async getLiving({ sort = 'longest-survival', limit = 24, offset = 0 }) {
    const { cemetery } = await loadCemetery();
    return paginate(sortLiving(cemetery.living, sort), limit, offset);
  },

  async getResurrected({ limit = 24, offset = 0 }) {
    const { cemetery } = await loadCemetery();
    const sorted = [...cemetery.resurrected].sort(
      (a, b) => b.resurrections - a.resurrections || b.deaths - a.deaths,
    );
    return paginate(sorted, limit, offset);
  },

  async getLeaderboard(
    section: LeaderboardSection,
    limit = 20,
  ): Promise<LeaderboardRow[]> {
    const { cemetery } = await loadCemetery();

    const row = (
      address: string,
      primaryValue: string,
      secondaryValue: string,
      index: number,
    ): LeaderboardRow => ({
      rank: index + 1,
      address,
      primaryValue,
      secondaryValue,
      state: cemetery.profiles.get(address.toLowerCase())?.state ?? 'NEVER',
      isDemo: false,
    });

    switch (section) {
      case 'longest-survivors':
        return sortLiving(cemetery.living, 'longest-survival')
          .slice(0, limit)
          .map((e, i) =>
            row(e.address, formatLifespan(e.holdingSeconds), e.level, i),
          );

      case 'biggest-survivors':
        return sortLiving(cemetery.living, 'largest-holder')
          .slice(0, limit)
          .map((e, i) =>
            row(
              e.address,
              `${compactAmount(e.balance)} $RIP`,
              formatLifespan(e.holdingSeconds),
              i,
            ),
          );

      case 'most-resurrected':
        return [...cemetery.resurrected]
          .sort((a, b) => b.resurrections - a.resurrections)
          .slice(0, limit)
          .map((e, i) =>
            row(
              e.address,
              `${e.resurrections} ${e.resurrections === 1 ? 'return' : 'returns'}`,
              `${e.deaths} ${e.deaths === 1 ? 'death' : 'deaths'}`,
              i,
            ),
          );

      case 'most-deaths':
        return [...cemetery.profiles.values()]
          .filter((p) => p.deaths > 0)
          .sort((a, b) => b.deaths - a.deaths)
          .slice(0, limit)
          .map((p, i) =>
            row(
              p.address,
              `${p.deaths} ${p.deaths === 1 ? 'death' : 'deaths'}`,
              `${p.totalLives} ${p.totalLives === 1 ? 'life' : 'lives'}`,
              i,
            ),
          );

      case 'oldest-living':
      default:
        return [...cemetery.profiles.values()]
          .filter((p) => p.firstSeenAt !== null && p.currentBalance > 0)
          .sort((a, b) => (a.firstSeenAt ?? 0) - (b.firstSeenAt ?? 0))
          .slice(0, limit)
          .map((p, i) =>
            row(
              p.address,
              formatLifespan(
                Math.floor(Date.now() / 1000) - (p.firstSeenAt ?? 0),
              ),
              `${p.totalLives} ${p.totalLives === 1 ? 'life' : 'lives'}`,
              i,
            ),
          );
    }
  },

  async getStats(): Promise<CemeteryStats> {
    const { cemetery } = await loadCemetery();
    return cemetery.stats;
  },
};

export { NotConfiguredError };

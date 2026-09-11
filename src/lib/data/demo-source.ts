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
import { generateDemoDataset, type DemoDataset } from '../mock/generator';
import { FUNNIEST_CAUSES } from '../domain/causes';
import { SURVIVAL_LEVELS } from '../domain/levels';
import { compactAmount, formatLifespan } from '../domain/format';
import { validateAddress } from '../utils';

/** How long the generated cemetery is reused before being rebuilt. */
const CACHE_TTL_SECONDS = 60;

let cached: DemoDataset | null = null;

function dataset(): DemoDataset {
  const now = Math.floor(Date.now() / 1000);
  if (!cached || now - cached.generatedAt > CACHE_TTL_SECONDS) {
    cached = generateDemoDataset(now);
  }
  return cached;
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
          b.totalDeathsForWallet - a.totalDeathsForWallet ||
          b.diedAt - a.diedAt,
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
        (a, b) => rank(b.level) - rank(a.level) || b.holdingSeconds - a.holdingSeconds,
      );
    }
    case 'longest-survival':
    default:
      return copy.sort((a, b) => b.holdingSeconds - a.holdingSeconds);
  }
}

/** Demo implementation of the data contract. */
export const demoDataSource: DataSource = {
  mode: 'demo',

  async getWalletProfile(address: string): Promise<WalletProfile | null> {
    const { valid, address: checksummed } = validateAddress(address);
    if (!valid || !checksummed) return null;
    return dataset().profiles.get(checksummed.toLowerCase()) ?? null;
  },

  async getGraves({ filter = 'all', limit = 24, offset = 0 }) {
    return paginate(sortGraves(dataset().graves, filter), limit, offset);
  },

  async getGraveByNumber(graveNumber: number): Promise<GraveyardEntry | null> {
    return (
      dataset().graves.find((g) => g.graveNumber === graveNumber) ?? null
    );
  },

  async getLiving({ sort = 'longest-survival', limit = 24, offset = 0 }) {
    return paginate(sortLiving(dataset().living, sort), limit, offset);
  },

  async getResurrected({ limit = 24, offset = 0 }) {
    const sorted = [...dataset().resurrected].sort(
      (a, b) => b.resurrections - a.resurrections || b.deaths - a.deaths,
    );
    return paginate(sorted, limit, offset);
  },

  async getLeaderboard(
    section: LeaderboardSection,
    limit = 20,
  ): Promise<LeaderboardRow[]> {
    const data = dataset();

    const row = (
      address: string,
      primaryValue: string,
      secondaryValue: string,
      index: number,
    ): LeaderboardRow => {
      const profile = data.profiles.get(address.toLowerCase());
      return {
        rank: index + 1,
        address,
        primaryValue,
        secondaryValue,
        state: profile?.state ?? 'NEVER',
        isDemo: true,
      };
    };

    switch (section) {
      case 'longest-survivors':
        return sortLiving(data.living, 'longest-survival')
          .slice(0, limit)
          .map((e, i) =>
            row(e.address, formatLifespan(e.holdingSeconds), e.level, i),
          );

      case 'biggest-survivors':
        return sortLiving(data.living, 'largest-holder')
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
        return [...data.resurrected]
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
        return [...data.profiles.values()]
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
        return [...data.profiles.values()]
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
    return dataset().stats;
  },
};

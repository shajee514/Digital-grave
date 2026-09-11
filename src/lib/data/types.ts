import type {
  CemeteryStats,
  GraveyardEntry,
  GraveyardFilter,
  LeaderboardRow,
  LeaderboardSection,
  LivingEntry,
  LivingSort,
  ResurrectedEntry,
  WalletProfile,
} from '../domain/types';

export interface Page<T> {
  items: T[];
  total: number;
}

/**
 * THE DATA CONTRACT
 *
 * Every page in the website talks to this interface and nothing else.
 * Right now it is answered by demo data. In Phase 2 a Supabase-backed
 * version is dropped in behind it and not a single page needs to change.
 */
export interface DataSource {
  readonly mode: 'demo' | 'live';

  getWalletProfile(address: string): Promise<WalletProfile | null>;

  getGraves(options: {
    filter?: GraveyardFilter;
    limit?: number;
    offset?: number;
  }): Promise<Page<GraveyardEntry>>;

  getGraveByNumber(graveNumber: number): Promise<GraveyardEntry | null>;

  getLiving(options: {
    sort?: LivingSort;
    limit?: number;
    offset?: number;
  }): Promise<Page<LivingEntry>>;

  getResurrected(options: {
    limit?: number;
    offset?: number;
  }): Promise<Page<ResurrectedEntry>>;

  getLeaderboard(section: LeaderboardSection, limit?: number): Promise<LeaderboardRow[]>;

  getStats(): Promise<CemeteryStats>;
}

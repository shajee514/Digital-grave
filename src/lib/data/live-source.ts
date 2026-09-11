import type { DataSource } from './types';

/**
 * LIVE DATA SOURCE — built in Phase 2 (Supabase) and Phase 4 (indexer).
 *
 * It is deliberately not implemented yet. Rather than returning invented
 * numbers, every method reports that the cemetery database is still being
 * set up, which the interface shows as a friendly message.
 *
 * Nothing here pretends to be production-ready.
 */

export class NotConfiguredError extends Error {
  constructor(what: string) {
    super(`CONFIGURATION REQUIRED: ${what}`);
    this.name = 'NotConfiguredError';
  }
}

function notReady(): never {
  throw new NotConfiguredError(
    'live data requires Supabase and the indexer (Phases 2-5)',
  );
}

export const liveDataSource: DataSource = {
  mode: 'live',
  getWalletProfile: notReady,
  getGraves: notReady,
  getGraveByNumber: notReady,
  getLiving: notReady,
  getResurrected: notReady,
  getLeaderboard: notReady,
  getStats: notReady,
};

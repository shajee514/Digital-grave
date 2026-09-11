import { publicEnv } from '../config/env';
import { demoDataSource } from './demo-source';
import { liveDataSource } from './live-source';
import type { DataSource } from './types';

/**
 * Picks where the website gets its data from.
 *
 * Controlled by ONE environment variable: NEXT_PUBLIC_DATA_MODE
 *   "demo" -> clearly-labelled sample data (default, safe before launch)
 *   "live" -> real indexed blockchain data
 */
export const dataSource: DataSource =
  publicEnv.dataMode === 'live' ? liveDataSource : demoDataSource;

export const isDemoMode = dataSource.mode === 'demo';

export type { DataSource, Page } from './types';
export { NotConfiguredError, ChainUnavailableError } from './errors';

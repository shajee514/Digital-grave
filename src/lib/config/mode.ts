import { publicEnv } from './env';

/**
 * Which data mode the site is running in.
 *
 * This lives in its own tiny module so that CLIENT components can ask the
 * question without pulling the server-only data layer (and the blockchain
 * code behind it) into the browser bundle.
 */
export const isDemoMode = publicEnv.dataMode !== 'live';
export const isLiveMode = !isDemoMode;

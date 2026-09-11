import { createPublicClient, http, type PublicClient } from 'viem';
import { robinhoodChain } from '@/lib/config/chain';
import { publicEnv } from '@/lib/config/env';
import { NotConfiguredError } from '@/lib/data/errors';

/**
 * The read-only connection to Robinhood Chain.
 *
 * SERVER ONLY. This must never be imported by a client component — the
 * RPC endpoint is called from the server so the browser never has to.
 *
 * It only ever READS. No private key is used, held or requested anywhere
 * in this file or anywhere else in the project.
 */

let cached: PublicClient | null = null;

export function getPublicClient(): PublicClient {
  if (!publicEnv.rpcUrl) {
    throw new NotConfiguredError('NEXT_PUBLIC_RH_RPC_URL is not set');
  }

  if (!cached) {
    cached = createPublicClient({
      chain: robinhoodChain,
      transport: http(publicEnv.rpcUrl, {
        timeout: 15_000,
        retryCount: 2,
        retryDelay: 400,
      }),
    }) as PublicClient;
  }

  return cached;
}

/** Clears the cached client. Used when configuration changes. */
export function resetPublicClient(): void {
  cached = null;
}

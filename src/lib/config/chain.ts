import { defineChain } from 'viem';
import { publicEnv } from './env';

/**
 * Robinhood Chain definition, built entirely from environment variables.
 * Nothing here is hardcoded except the documented mainnet chain id default.
 */
export const robinhoodChain = defineChain({
  id: publicEnv.chainId,
  name: publicEnv.chainName,
  nativeCurrency: {
    name: publicEnv.nativeSymbol,
    symbol: publicEnv.nativeSymbol,
    decimals: publicEnv.nativeDecimals,
  },
  rpcUrls: {
    default: { http: publicEnv.rpcUrl ? [publicEnv.rpcUrl] : [] },
  },
  blockExplorers: publicEnv.explorerUrl
    ? { default: { name: 'Explorer', url: publicEnv.explorerUrl } }
    : undefined,
});

/** True when we actually have an RPC endpoint to talk to. */
export const hasRpc = publicEnv.rpcUrl.length > 0;

/** Builds an explorer link, or null when no explorer is configured yet. */
export function explorerLink(
  kind: 'tx' | 'address' | 'token',
  value: string,
): string | null {
  if (!publicEnv.explorerUrl || !value) return null;
  const base = publicEnv.explorerUrl.replace(/\/+$/, '');
  return `${base}/${kind}/${value}`;
}

import { publicEnv } from './env';
import { isAddress, getAddress, type Address } from 'viem';

/**
 * THE SINGLE PLACE where every contract address lives.
 * Never hardcode an address anywhere else in the app.
 *
 * Each entry is `null` until it has been configured, and the UI shows
 * "CONFIGURATION REQUIRED" for anything that is still null.
 */

function addr(raw: string): Address | null {
  if (!raw) return null;
  try {
    return isAddress(raw) ? getAddress(raw) : null;
  } catch {
    return null;
  }
}

function addrList(raw: string): Address[] {
  return raw
    .split(',')
    .map((part) => addr(part.trim()))
    .filter((a): a is Address => a !== null);
}

export const contracts = {
  chainId: publicEnv.chainId,
  chainName: publicEnv.chainName,
  explorerUrl: publicEnv.explorerUrl || null,

  token: addr(publicEnv.tokenAddress),
  tokenDecimals: publicEnv.tokenDecimals,
  tokenSymbol: publicEnv.tokenSymbol,

  /** DEX pair(s) holding $RIP liquidity. Buying/selling happens against these. */
  pairs: addrList(publicEnv.pairAddress),
  /** DEX router(s) users route swaps through. */
  routers: addrList(publicEnv.routerAddress),
  factory: addr(publicEnv.factoryAddress),
  dexName: publicEnv.dexName || null,
  dexSwapUrl: publicEnv.dexSwapUrl || null,
} as const;

/** The token is the one thing everything else depends on. */
export const isTokenConfigured = contracts.token !== null;

/**
 * BUY/SELL detection is only trustworthy once we know which addresses are
 * DEX addresses. Without them every movement is just a plain transfer.
 */
export const isDexConfigured =
  contracts.pairs.length > 0 || contracts.routers.length > 0;

/** Every address we treat as "the market" rather than "a person". */
export function marketAddresses(): Address[] {
  return [...contracts.pairs, ...contracts.routers];
}

export function isMarketAddress(candidate: string | null | undefined): boolean {
  if (!candidate) return false;
  const lower = candidate.toLowerCase();
  return marketAddresses().some((a) => a.toLowerCase() === lower);
}

/** Human-readable list of what still needs to be configured. */
export function missingConfiguration(): string[] {
  const missing: string[] = [];
  if (!publicEnv.rpcUrl) missing.push('NEXT_PUBLIC_RH_RPC_URL');
  if (!contracts.token) missing.push('NEXT_PUBLIC_RIP_TOKEN_ADDRESS');
  if (contracts.pairs.length === 0) missing.push('NEXT_PUBLIC_RIP_PAIR_ADDRESS');
  if (contracts.routers.length === 0) missing.push('NEXT_PUBLIC_RIP_ROUTER_ADDRESS');
  if (!publicEnv.explorerUrl) missing.push('NEXT_PUBLIC_RH_EXPLORER_URL');
  return missing;
}

import { erc20Abi, formatUnits, type Address } from 'viem';
import { getPublicClient } from './client';
import { contracts } from '@/lib/config/contracts';
import { NotConfiguredError } from '@/lib/data/errors';

/**
 * Reads the $RIP token contract.
 *
 * Everything here is a public, read-only call. Nothing is ever written to
 * the chain and no signature is ever requested.
 */

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  totalSupplyRaw: bigint;
}

let cachedInfo: { info: TokenInfo; at: number } | null = null;
const INFO_TTL_MS = 5 * 60_000;

export function requireToken(): Address {
  if (!contracts.token) {
    throw new NotConfiguredError('NEXT_PUBLIC_RIP_TOKEN_ADDRESS is not set');
  }
  return contracts.token;
}

/** Reads name, symbol, decimals and supply straight from the contract. */
export async function getTokenInfo(): Promise<TokenInfo> {
  const address = requireToken();

  if (cachedInfo && Date.now() - cachedInfo.at < INFO_TTL_MS) {
    return cachedInfo.info;
  }

  const client = getPublicClient();

  // Deliberately four separate calls rather than a multicall: multicall
  // needs a helper contract deployed on the chain, and we cannot assume
  // one exists. A token that does not implement name/symbol still works,
  // because those two fall back to the configured values.
  const read = <T>(functionName: 'name' | 'symbol' | 'decimals' | 'totalSupply') =>
    client.readContract({ address, abi: erc20Abi, functionName }) as Promise<T>;

  const [nameResult, symbolResult, decimalsResult, supplyResult] =
    await Promise.allSettled([
      read<string>('name'),
      read<string>('symbol'),
      read<number>('decimals'),
      read<bigint>('totalSupply'),
    ]);

  if (decimalsResult.status !== 'fulfilled') {
    throw new NotConfiguredError(
      'the configured address did not answer as an ERC-20 token',
    );
  }

  const decimals = Number(decimalsResult.value);
  const totalSupplyRaw =
    supplyResult.status === 'fulfilled' ? supplyResult.value : 0n;

  const info: TokenInfo = {
    address,
    name: nameResult.status === 'fulfilled' ? nameResult.value : 'Digital Grave',
    symbol:
      symbolResult.status === 'fulfilled'
        ? symbolResult.value
        : contracts.tokenSymbol,
    decimals,
    totalSupplyRaw,
    totalSupply: Number(formatUnits(totalSupplyRaw, decimals)),
  };

  cachedInfo = { info, at: Date.now() };
  return info;
}

/** Reads one wallet's current token balance directly from the chain. */
export async function getTokenBalance(
  wallet: Address,
  decimals: number,
): Promise<number> {
  const client = getPublicClient();
  const raw = await client.readContract({
    address: requireToken(),
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [wallet],
  });
  return Number(formatUnits(raw, decimals));
}

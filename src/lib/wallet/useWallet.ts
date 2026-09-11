'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createWalletClient,
  custom,
  getAddress,
  numberToHex,
  type EIP1193Provider,
} from 'viem';
import { robinhoodChain } from '@/lib/config/chain';
import { publicEnv } from '@/lib/config/env';
import { useIsClient } from '@/lib/useIsClient';
import { track } from '@/lib/analytics';

/**
 * OPTIONAL wallet connection.
 *
 * Uses the standard browser wallet interface (EIP-1193) through viem.
 * The site NEVER asks for a seed phrase, a private key or a password,
 * and it never stores anything about the connected wallet on a server.
 * Connecting is only needed for the personal "My Grave" page.
 */

interface EthereumWindow extends Window {
  ethereum?: EIP1193Provider;
}

function getProvider(): EIP1193Provider | null {
  if (typeof window === 'undefined') return null;
  return (window as EthereumWindow).ethereum ?? null;
}

export type WalletStatus =
  | 'unsupported'
  | 'disconnected'
  | 'connecting'
  | 'connected';

export function useWallet() {
  const ready = useIsClient();
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Whether a browser wallet exists is read directly, not stored in state.
  const hasProvider = ready && getProvider() !== null;

  /**
   * Reconnects silently if this site was already approved, and keeps up
   * with account or network changes. Every setState below happens inside an
   * async callback or an event handler — never directly in the effect body.
   */
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    let cancelled = false;

    void (async () => {
      try {
        const accounts = (await provider.request({
          method: 'eth_accounts',
        })) as string[];
        if (cancelled || accounts.length === 0) return;

        setAddress(getAddress(accounts[0]));
        const id = (await provider.request({ method: 'eth_chainId' })) as string;
        if (!cancelled) setChainId(Number.parseInt(id, 16));
      } catch {
        // A wallet that refuses to answer is treated as not connected.
      }
    })();

    const onAccountsChanged = (...args: unknown[]) => {
      const accounts = (args[0] as string[]) ?? [];
      setAddress(accounts.length > 0 ? getAddress(accounts[0]) : null);
    };

    const onChainChanged = (...args: unknown[]) => {
      setChainId(Number.parseInt(args[0] as string, 16));
    };

    provider.on('accountsChanged', onAccountsChanged);
    provider.on('chainChanged', onChainChanged);

    return () => {
      cancelled = true;
      provider.removeListener('accountsChanged', onAccountsChanged);
      provider.removeListener('chainChanged', onChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    track('connect_wallet_click');

    if (!provider) {
      setError('No browser wallet detected. Install one to continue.');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      const client = createWalletClient({
        chain: robinhoodChain,
        transport: custom(provider),
      });
      const accounts = await client.requestAddresses();
      if (accounts.length === 0) {
        setError('No account was shared.');
        return;
      }
      setAddress(getAddress(accounts[0]));
      const id = (await provider.request({ method: 'eth_chainId' })) as string;
      setChainId(Number.parseInt(id, 16));
      track('connect_wallet_success');
    } catch (err) {
      setError(
        err instanceof Error && /reject|denied/i.test(err.message)
          ? 'Connection cancelled.'
          : 'Could not connect to your wallet. Please try again.',
      );
    } finally {
      setConnecting(false);
    }
  }, []);

  /** Clears the local session only. It cannot revoke wallet permissions. */
  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setError(null);
  }, []);

  /** Asks the wallet to switch to Robinhood Chain, adding it if unknown. */
  const switchNetwork = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return;
    const hexId = numberToHex(publicEnv.chainId);

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexId }],
      });
    } catch {
      if (!publicEnv.rpcUrl) {
        setError('Network details are not configured yet.');
        return;
      }
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexId,
              chainName: publicEnv.chainName,
              nativeCurrency: {
                name: publicEnv.nativeSymbol,
                symbol: publicEnv.nativeSymbol,
                decimals: publicEnv.nativeDecimals,
              },
              rpcUrls: [publicEnv.rpcUrl],
              blockExplorerUrls: publicEnv.explorerUrl
                ? [publicEnv.explorerUrl]
                : undefined,
            },
          ],
        });
      } catch {
        setError('Could not switch network. Please switch manually.');
      }
    }
  }, []);

  /** The status is derived, so it can never drift out of sync. */
  const status: WalletStatus = useMemo(() => {
    if (!ready) return 'disconnected';
    if (address) return 'connected';
    if (connecting) return 'connecting';
    if (!hasProvider) return 'unsupported';
    return 'disconnected';
  }, [ready, address, connecting, hasProvider]);

  const wrongNetwork =
    status === 'connected' && chainId !== null && chainId !== publicEnv.chainId;

  return {
    status,
    address,
    chainId,
    error,
    ready,
    wrongNetwork,
    connect,
    disconnect,
    switchNetwork,
  };
}

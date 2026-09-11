'use client';

import { useEffect, useState } from 'react';
import { Container, Panel, SectionHeading } from '@/components/ui/Panel';
import { Button, ButtonLink } from '@/components/ui/Button';
import { WalletProfileView } from '@/components/wallet/WalletProfileView';
import { LoadingMessage } from '@/components/ui/States';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { Gravestone } from '@/components/brand/Gravestone';
import { useWallet } from '@/lib/wallet/useWallet';
import { publicEnv } from '@/lib/config/env';
import { ERROR_MESSAGES } from '@/lib/domain/copy';
import type { WalletProfile } from '@/lib/domain/types';

/**
 * The personal page. This is the ONLY place a wallet connection is used,
 * and it is entirely optional — every other page works without one.
 */
export function MyGraveClient() {
  const { status, address, ready, error, wrongNetwork, connect, switchNetwork } =
    useWallet();

  /**
   * The fetched result remembers WHICH address it belongs to. Loading and
   * error states are then derived from it, so no state has to be written
   * directly inside the effect.
   */
  const [result, setResult] = useState<{
    address: string;
    profile: WalletProfile | null;
  } | null>(null);

  useEffect(() => {
    if (!address) return;

    const controller = new AbortController();

    fetch(`/api/wallet/${address}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as { profile: WalletProfile };
      })
      .then((data) => setResult({ address, profile: data.profile }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setResult({ address, profile: null });
      });

    return () => controller.abort();
  }, [address]);

  const settled = address !== null && result?.address === address;
  const loading = address !== null && !settled;
  const profile = settled ? result.profile : null;
  const loadError = settled && result.profile === null ? ERROR_MESSAGES.indexerDown : null;

  if (!ready) {
    return (
      <Container className="py-16">
        <ListSkeleton rows={3} />
      </Container>
    );
  }

  // ---------- Not connected ----------
  if (status !== 'connected' || !address) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Optional"
              title="My Grave"
              subtitle="Connect your wallet to see your own life story in one place. You can also just paste your address into the search box — it works exactly the same, with no connection at all."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => void connect()} disabled={status === 'connecting'}>
                {status === 'connecting' ? 'CONNECTING...' : 'CONNECT WALLET'}
              </Button>
              <ButtonLink href="/search" variant="secondary" size="lg">
                SEARCH INSTEAD
              </ButtonLink>
            </div>

            {status === 'unsupported' ? (
              <p className="mt-4 text-sm text-ash">
                No browser wallet was detected. You can still use every part of
                this site by searching for your address.
              </p>
            ) : null}

            {error ? <p className="mt-4 text-sm text-dead">{error}</p> : null}

            <Panel className="mt-8 border-alive/25">
              <h2 className="label-caps text-alive">Your safety</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-ash">
                <li>✅ Connecting only shares your public address</li>
                <li>✅ No transaction or signature is ever requested</li>
                <li>❌ We never ask for a seed phrase or private key</li>
                <li>❌ Nothing about your wallet is stored on our servers</li>
              </ul>
            </Panel>
          </div>

          <div className="flex justify-center">
            <Gravestone className="h-64 w-64 sm:h-80 sm:w-80" accent="alive" />
          </div>
        </div>
      </Container>
    );
  }

  // ---------- Wrong network ----------
  if (wrongNetwork) {
    return (
      <Container className="py-16">
        <Panel className="mx-auto max-w-lg border-dead/30 text-center">
          <span className="text-4xl" aria-hidden>
            🔌
          </span>
          <h1 className="mt-3 font-display text-xl font-bold">Wrong network</h1>
          <p className="mt-2 text-sm text-ash">
            Your wallet is connected to a different network. Switch to{' '}
            {publicEnv.chainName} to continue.
          </p>
          <Button className="mt-5" onClick={() => void switchNetwork()}>
            SWITCH NETWORK
          </Button>
        </Panel>
      </Container>
    );
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <Container className="py-16">
        <div className="mb-6 text-center">
          <LoadingMessage />
        </div>
        <ListSkeleton rows={4} />
      </Container>
    );
  }

  // ---------- Failed ----------
  if (loadError || !profile) {
    return (
      <Container className="py-16">
        <Panel className="mx-auto max-w-lg border-dead/30 text-center">
          <span className="text-4xl" aria-hidden>
            ⛏️
          </span>
          <h1 className="mt-3 font-display text-xl font-bold">
            The cemetery is updating
          </h1>
          <p className="mt-2 text-sm text-ash">{loadError ?? ERROR_MESSAGES.indexerDown}</p>
          <ButtonLink href="/" variant="secondary" size="md" className="mt-5">
            BACK HOME
          </ButtonLink>
        </Panel>
      </Container>
    );
  }

  return <WalletProfileView profile={profile} title="My Grave" />;
}

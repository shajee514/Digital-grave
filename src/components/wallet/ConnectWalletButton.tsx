'use client';

import { useWallet } from '@/lib/wallet/useWallet';
import { Button } from '@/components/ui/Button';
import { shortAddress } from '@/lib/domain/format';
import { publicEnv } from '@/lib/config/env';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

export function ConnectWalletButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const { status, address, ready, wrongNetwork, connect, disconnect, switchNetwork } =
    useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  // Render a stable placeholder until the browser has been checked,
  // so the server and client markup always match.
  if (!ready) {
    return (
      <div
        className={cn('h-9 rounded-xl border border-moss bg-granite/40', fullWidth ? 'w-full' : 'w-32')}
        aria-hidden
      />
    );
  }

  if (status === 'connected' && address) {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors',
            wrongNetwork
              ? 'border-dead/50 bg-dead/10 text-dead'
              : 'border-alive/40 bg-alive/10 text-alive hover:bg-alive/15',
            fullWidth && 'w-full justify-center',
          )}
          aria-expanded={menuOpen}
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              wrongNetwork ? 'bg-dead' : 'bg-alive animate-pulse-glow',
            )}
            aria-hidden
          />
          <span className="font-mono">{shortAddress(address)}</span>
        </button>

        {menuOpen ? (
          <div
            className={cn(
              'absolute right-0 z-50 mt-2 w-56 rounded-xl border border-moss bg-stone p-2 shadow-xl',
              fullWidth && 'w-full',
            )}
          >
            {wrongNetwork ? (
              <button
                type="button"
                onClick={() => {
                  void switchNetwork();
                  setMenuOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-dead hover:bg-granite"
              >
                Switch to {publicEnv.chainName}
              </button>
            ) : null}
            <Link
              href="/my-grave"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-bone hover:bg-granite"
            >
              My Grave
            </Link>
            <button
              type="button"
              onClick={() => {
                disconnect();
                setMenuOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-ash hover:bg-granite hover:text-bone"
            >
              Disconnect
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => void connect()}
      disabled={status === 'connecting'}
      className={cn(fullWidth && 'w-full')}
    >
      {status === 'connecting' ? 'CONNECTING...' : 'CONNECT WALLET'}
    </Button>
  );
}

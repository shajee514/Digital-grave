'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { validateAddress } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { FEATURED_DEMO_WALLETS } from '@/lib/mock/addresses';
import { isDemoMode } from '@/lib/data';

/**
 * The main entry point of the product.
 * No wallet connection is required to search — anyone can look up
 * any public wallet address.
 */
export function WalletSearch({
  size = 'lg',
  showExamples = true,
  autoFocus = false,
}: {
  size?: 'md' | 'lg';
  showExamples?: boolean;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = validateAddress(value);

    if (!result.valid || !result.address) {
      setError(result.error);
      return;
    }

    setError(null);
    setPending(true);
    track('wallet_search', { source: size === 'lg' ? 'hero' : 'inline' });
    router.push(`/wallet/${result.address}`);
  }

  const isLarge = size === 'lg';

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={cn(
            'flex flex-col gap-3 rounded-2xl border bg-stone/70 p-2 backdrop-blur-sm transition-colors sm:flex-row sm:items-center',
            error ? 'border-dead/50' : 'border-moss focus-within:border-alive/50',
          )}
        >
          <label htmlFor="wallet-search" className="sr-only">
            Wallet address
          </label>
          <input
            id="wallet-search"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="0x..."
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'wallet-search-error' : undefined}
            className={cn(
              'w-full flex-1 bg-transparent px-4 font-mono text-bone placeholder:text-ash/50 focus:outline-none',
              isLarge ? 'h-12 text-base' : 'h-10 text-sm',
            )}
          />
          <button
            type="submit"
            disabled={pending}
            className={cn(
              'shrink-0 rounded-xl bg-alive font-bold tracking-wide text-void shadow-glow-alive transition-all hover:bg-alive/90 active:scale-[0.98] disabled:opacity-60',
              isLarge ? 'h-12 px-6 text-sm' : 'h-10 px-5 text-xs',
            )}
          >
            {pending ? 'SEARCHING...' : 'SEARCH GRAVE'}
          </button>
        </div>
      </form>

      {error ? (
        <p id="wallet-search-error" role="alert" className="mt-2.5 px-1 text-sm text-dead">
          {error}
        </p>
      ) : (
        <p className="mt-2.5 px-1 text-xs text-ash">
          No wallet connection needed. Search any public address.
        </p>
      )}

      {showExamples && isDemoMode ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ash">
            Try a demo wallet:
          </span>
          {FEATURED_DEMO_WALLETS.map((wallet) => (
            <button
              key={wallet.address}
              type="button"
              onClick={() => {
                setValue(wallet.address);
                setError(null);
              }}
              className="rounded-full border border-legendary/30 bg-legendary/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-legendary transition-colors hover:bg-legendary/15"
            >
              {wallet.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

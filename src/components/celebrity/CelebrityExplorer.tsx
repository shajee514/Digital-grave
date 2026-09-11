'use client';

import { useMemo, useState } from 'react';
import { CelebrityCard } from './CelebrityCard';
import { RandomGraveButton } from './RandomGraveButton';
import { CELEBRITY_FILTERS, matchesFilter, matchesQuery } from '@/lib/celebrities/source';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Celebrity, CelebrityFilter } from '@/lib/celebrities/types';

/**
 * Search + filters + the card grid.
 *
 * The roster is small and already on the page, so filtering happens
 * instantly in the browser with no extra network requests.
 */
export function CelebrityExplorer({ celebrities }: { celebrities: Celebrity[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CelebrityFilter>('all');

  const results = useMemo(
    () =>
      celebrities.filter((c) => matchesFilter(c, filter) && matchesQuery(c, query)),
    [celebrities, filter, query],
  );

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full lg:max-w-md">
          <label htmlFor="celebrity-search" className="sr-only">
            Search the celebrity cemetery
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-moss bg-stone/70 p-2 backdrop-blur-sm transition-colors focus-within:border-reborn/50">
            <span className="pl-2 text-ash" aria-hidden>
              🔍
            </span>
            <input
              id="celebrity-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length > 2) {
                  track('celebrity_search', { length: e.target.value.length });
                }
              }}
              placeholder="Search the celebrity cemetery..."
              autoComplete="off"
              className="h-10 w-full flex-1 bg-transparent text-sm text-bone placeholder:text-ash/60 focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="shrink-0 rounded-lg px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ash transition-colors hover:text-bone"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <RandomGraveButton celebrities={celebrities} className="lg:items-end" />
      </div>

      {/* Filters */}
      <div
        className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        role="tablist"
        aria-label="Celebrity categories"
      >
        {CELEBRITY_FILTERS.map((option) => {
          const active = option.key === filter;
          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setFilter(option.key);
                track('filter_change', { section: 'celebrities', filter: option.key });
              }}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all',
                active
                  ? 'border-reborn/50 bg-reborn/10 text-reborn'
                  : 'border-moss bg-granite/40 text-ash hover:border-ash/50 hover:text-bone',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-ash">
        Showing {results.length} of {celebrities.length} fictional graves. These
        categories are meme labels only — they do not describe anyone&apos;s
        real-world status.
      </p>

      {/* Results */}
      <div className="mt-6">
        {results.length === 0 ? (
          <div className="stone-panel flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="text-5xl opacity-70" aria-hidden>
              👻
            </span>
            <p className="text-sm text-ash">
              The cemetery hasn&apos;t heard of them yet.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
              className="rounded-lg border border-moss bg-granite/60 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:border-ash/60 hover:text-bone"
            >
              Show everyone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((celebrity) => (
              <CelebrityCard key={celebrity.id} celebrity={celebrity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

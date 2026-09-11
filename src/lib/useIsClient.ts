'use client';

import { useSyncExternalStore } from 'react';

/** No external store to watch — the value never changes after mount. */
const subscribe = () => () => {};

/**
 * Returns false while rendering on the server and during the first
 * browser render, then true afterwards.
 *
 * This is the safe way to show browser-only values (like a live clock or a
 * detected wallet) without the server and the browser disagreeing about
 * what the page should look like.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

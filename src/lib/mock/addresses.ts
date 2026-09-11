/**
 * DEMO wallet addresses.
 *
 * These are real-format EVM addresses so every validation path behaves
 * exactly like production, but they are obviously fake on sight and are
 * always labelled DEMO in the interface.
 */

function padAddress(prefix: string): string {
  const clean = prefix.toLowerCase().replace(/[^0-9a-f]/g, '');
  return `0x${clean.padEnd(40, '0').slice(0, 40)}`;
}

export const DEMO_ALIVE = padAddress('a11fe'); // "ALIFE"
export const DEMO_DEAD = padAddress('dead'); // "DEAD"
export const DEMO_REBORN = padAddress('c0ffee'); // came back for coffee

export const FEATURED_DEMO_WALLETS = [
  { address: DEMO_ALIVE, label: 'DEMO — ALIVE', hint: 'A wallet still holding.' },
  { address: DEMO_DEAD, label: 'DEMO — DEAD', hint: 'A wallet that sold everything.' },
  {
    address: DEMO_REBORN,
    label: 'DEMO — RESURRECTED',
    hint: 'A wallet that died and came back.',
  },
] as const;

/** Builds the rest of the demo cemetery population. */
export function demoAddress(index: number): string {
  const hex = (index * 2654435761 >>> 0).toString(16).padStart(8, '0');
  const tail = ((index + 7) * 40503 >>> 0).toString(16).padStart(8, '0');
  return padAddress(`${hex}${tail}${hex}${tail}${hex}`);
}

export function isDemoAddress(address: string): boolean {
  const lower = address.toLowerCase();
  if ([DEMO_ALIVE, DEMO_DEAD, DEMO_REBORN].includes(lower)) return true;
  for (let i = 0; i < 120; i += 1) {
    if (demoAddress(i) === lower) return true;
  }
  return false;
}

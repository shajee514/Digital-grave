import { isAddress, getAddress } from 'viem';

/** Joins class names, ignoring falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface AddressValidation {
  valid: boolean;
  /** Checksummed address when valid. */
  address: string | null;
  error: string | null;
}

/**
 * Validates an EVM wallet address.
 * Used on both the client and the server — never trust the client alone.
 */
export function validateAddress(raw: string): AddressValidation {
  const trimmed = (raw ?? '').trim();

  if (!trimmed) {
    return { valid: false, address: null, error: 'Enter a wallet address.' };
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return {
      valid: false,
      address: null,
      error: "That's not a valid wallet address.",
    };
  }
  try {
    if (!isAddress(trimmed, { strict: false })) {
      return {
        valid: false,
        address: null,
        error: "That's not a valid wallet address.",
      };
    }
    return { valid: true, address: getAddress(trimmed), error: null };
  } catch {
    return {
      valid: false,
      address: null,
      error: "That's not a valid wallet address.",
    };
  }
}

/** Validates a transaction hash. */
export function isValidTxHash(raw: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test((raw ?? '').trim());
}

/** Clamps a page-size style number into a safe range. */
export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/** Deterministic pseudo-random number in [0,1) from a string seed. */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

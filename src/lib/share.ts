import type { Grave, WalletProfile } from './domain/types';
import { formatGraveNumber, formatLifespan, daysFrom } from './domain/format';
import { site } from './config/site';

/**
 * Share text builders.
 *
 * Only the grave number and the lifespan are included. The full wallet
 * address is never placed into share text.
 */

export function graveShareText(grave: Grave): string {
  return [
    '🪦 I DIED.',
    '',
    `Held $RIP for ${formatLifespan(grave.lifespanSeconds)}.`,
    '',
    'Cause of Death:',
    grave.causeOfDeath,
    '',
    `Grave ${formatGraveNumber(grave.graveNumber)}`,
    '',
    '💀',
    '',
    site.name,
  ].join('\n');
}

export function survivorShareText(profile: WalletProfile): string {
  const days = daysFrom(profile.currentLifeSeconds);
  return [
    '🟢 Still ALIVE.',
    '',
    `I've survived $RIP for ${days} ${days === 1 ? 'day' : 'days'}.`,
    '',
    'They tried to kill me.',
    '',
    'I refused.',
    '',
    '$RIP',
  ].join('\n');
}

export function resurrectionShareText(profile: WalletProfile): string {
  return [
    '⚡ I CAME BACK FROM THE DEAD.',
    '',
    `Deaths: ${profile.deaths}`,
    '',
    `Resurrections: ${profile.resurrections}`,
    '',
    'Still holding $RIP.',
  ].join('\n');
}

export function shareTextForProfile(profile: WalletProfile): string {
  if (profile.state === 'RESURRECTED') return resurrectionShareText(profile);
  if (profile.state === 'ALIVE') return survivorShareText(profile);
  if (profile.state === 'DEAD' && profile.graves.length > 0) {
    return graveShareText(profile.graves[profile.graves.length - 1]);
  }
  return [
    '👻 NOT YET DEAD.',
    '',
    "The cemetery doesn't know me yet.",
    '',
    '🪦 My grave is still available.',
    '',
    '$RIP',
  ].join('\n');
}

/** Builds an X (Twitter) intent link. */
export function xIntentUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://x.com/intent/tweet?${params.toString()}`;
}

export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

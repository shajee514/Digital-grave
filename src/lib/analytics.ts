/**
 * ANONYMOUS PRODUCT ANALYTICS
 *
 * Records only what happened, never who did it. No wallet addresses,
 * no IP addresses, no personal information of any kind.
 *
 * Right now events are simply logged in development. A provider can be
 * plugged into `send()` later without touching any component.
 */

export type AnalyticsEvent =
  | 'page_view'
  | 'wallet_search'
  | 'grave_view'
  | 'share_click'
  | 'share_x_click'
  | 'share_copy_link'
  | 'share_download_image'
  | 'share_copy_text'
  | 'celebrity_view'
  | 'celebrity_search'
  | 'celebrity_random'
  | 'connect_wallet_click'
  | 'connect_wallet_success'
  | 'filter_change';

/** Only non-identifying values are allowed. */
export type AnalyticsProps = Record<string, string | number | boolean>;

const FORBIDDEN_KEYS = ['address', 'wallet', 'email', 'ip', 'user'];

function scrub(props: AnalyticsProps): AnalyticsProps {
  const clean: AnalyticsProps = {};
  for (const [key, value] of Object.entries(props)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN_KEYS.some((f) => lower.includes(f))) continue;
    if (typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value)) continue;
    clean[key] = value;
  }
  return clean;
}

function send(event: AnalyticsEvent, props: AnalyticsProps): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, props);
  }
  // A real provider would be called here.
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  try {
    send(event, scrub(props));
  } catch {
    // Analytics must never break the page.
  }
}

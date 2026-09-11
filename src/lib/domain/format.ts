/** Display helpers. Everything here is pure formatting — no data invention. */

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86_400;

/** "0x71...92A" — the only wallet form we show publicly by default. */
export function shortAddress(address: string, lead = 4, tail = 3): string {
  if (!address) return '';
  if (address.length <= lead + tail + 2) return address;
  return `${address.slice(0, 2 + lead)}...${address.slice(-tail)}`;
}

/** "2 Days 14 Hours" */
export function formatLifespan(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const days = Math.floor(total / DAY);
  const hours = Math.floor((total % DAY) / HOUR);
  const minutes = Math.floor((total % HOUR) / MINUTE);

  if (days > 0) {
    const d = `${days} ${days === 1 ? 'Day' : 'Days'}`;
    return hours > 0 ? `${d} ${hours} ${hours === 1 ? 'Hour' : 'Hours'}` : d;
  }
  if (hours > 0) {
    const h = `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
    return minutes > 0 ? `${h} ${minutes} Min` : h;
  }
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`;
  return 'Less than a minute';
}

/** Whole days only — used for level maths and short summaries. */
export function daysFrom(seconds: number): number {
  return Math.floor(Math.max(0, seconds) / DAY);
}

/** Splits a duration into a countdown-style object. */
export function splitDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  return {
    days: Math.floor(total / DAY),
    hours: Math.floor((total % DAY) / HOUR),
    minutes: Math.floor((total % HOUR) / MINUTE),
    seconds: total % MINUTE,
  };
}

/** "10 Sep 2026" — fixed locale so server and browser always agree. */
export function formatDate(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ][d.getUTCMonth()];
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

/** "10 Sep 2026, 14:32 UTC" */
export function formatDateTime(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${formatDate(unixSeconds)}, ${hh}:${mm} UTC`;
}

/** "3 days ago" */
export function timeAgo(unixSeconds: number, now = Date.now() / 1000): string {
  const diff = Math.max(0, Math.floor(now - unixSeconds));
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  }
  const d = Math.floor(diff / DAY);
  return `${d} ${d === 1 ? 'day' : 'days'} ago`;
}

/** "125,000" */
export function formatAmount(amount: number, maxDecimals = 2): string {
  if (!Number.isFinite(amount)) return '0';
  const abs = Math.abs(amount);
  const decimals = abs > 0 && abs < 1 ? 4 : amount % 1 === 0 ? 0 : maxDecimals;
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/** "1.2M" — for tight spaces like leaderboard rows. */
export function compactAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return formatAmount(amount);
}

/** "#004281" */
export function formatGraveNumber(graveNumber: number): string {
  return `#${String(graveNumber).padStart(6, '0')}`;
}

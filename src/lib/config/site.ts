import { publicEnv } from './env';

export const site = {
  name: 'DIGITAL GRAVE',
  ticker: '$RIP',
  slogan: 'BUY. HOLD. LIVE. SELL. DIE.',
  altSlogan: 'Everyone dies. Paper hands die first.',
  subtitle: [
    'Every wallet has a story.',
    'Every holder has a lifespan.',
    'Every paper hand gets a grave.',
  ],
  description:
    'Every wallet has a story. Buy. Hold. Live. Sell. Die. Resurrect.',
  url: publicEnv.siteUrl,
} as const;

export const navLinks = [
  { href: '/search', label: 'Search' },
  { href: '/graveyard', label: 'Graveyard' },
  { href: '/living', label: 'Living' },
  { href: '/resurrected', label: 'Resurrected' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/celebrities', label: 'Celebrities' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/token', label: 'Token' },
] as const;

/** Only real, configured links are shown. No placeholder social accounts. */
export const socialLinks = [
  { key: 'x', label: 'X', url: publicEnv.twitterUrl },
  { key: 'telegram', label: 'Telegram', url: publicEnv.telegramUrl },
  { key: 'discord', label: 'Discord', url: publicEnv.discordUrl },
].filter((link) => link.url.length > 0);

export const footerLinks = [
  { href: '/token', label: 'Token' },
  { href: '/graveyard', label: 'Graveyard' },
  { href: '/celebrities', label: 'Celebrity Graveyard' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
] as const;

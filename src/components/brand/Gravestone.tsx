import { cn } from '@/lib/utils';

/**
 * The mascot: a tilted cartoon gravestone reading RIP, with a goofy
 * skull peeking out from behind it. Drawn from scratch as SVG —
 * no copied or licensed artwork.
 */
export function Gravestone({
  className,
  accent = 'bone',
  animate = true,
}: {
  className?: string;
  accent?: 'bone' | 'alive' | 'dead' | 'reborn' | 'legendary' | 'ghost';
  animate?: boolean;
}) {
  const accentMap = {
    bone: '#8b8b99',
    alive: '#22e07a',
    dead: '#ff4d5e',
    reborn: '#a06bff',
    legendary: '#ffc94d',
    ghost: '#7fd4ff',
  } as const;
  const glow = accentMap[accent];

  return (
    <svg
      viewBox="0 0 240 240"
      className={cn(className, animate && 'animate-float')}
      role="img"
      aria-label="A tilted cartoon gravestone engraved with R I P, with a skull peeking out behind it"
    >
      <defs>
        <linearGradient id="dg-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a46" />
          <stop offset="55%" stopColor="#26262f" />
          <stop offset="100%" stopColor="#16161b" />
        </linearGradient>
        <linearGradient id="dg-skull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f4f8" />
          <stop offset="100%" stopColor="#c2c2cf" />
        </linearGradient>
        <radialGradient id="dg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.45" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="120" cy="150" rx="105" ry="80" fill="url(#dg-glow)" />

      {/* Skull peeking from behind the stone */}
      <g transform="translate(150 78) rotate(12)">
        <path
          d="M0 22C0 8 12 -2 27 -2S54 8 54 22c0 9-4 15-9 19v9c0 4-3 7-7 7H16c-4 0-7-3-7-7v-9C4 37 0 31 0 22Z"
          fill="url(#dg-skull)"
        />
        {/* Eyes */}
        <ellipse cx="17" cy="21" rx="7" ry="8.5" fill="#0a0a0c" />
        <ellipse cx="38" cy="21" rx="7" ry="8.5" fill="#0a0a0c" />
        <circle cx="19" cy="19" r="2.2" fill={glow} className={animate ? 'animate-pulse-glow' : ''} />
        <circle cx="40" cy="19" r="2.2" fill={glow} className={animate ? 'animate-pulse-glow' : ''} />
        {/* Nose + goofy grin */}
        <path d="M27 29l-4 7h8l-4-7Z" fill="#0a0a0c" />
        <rect x="17" y="41" width="21" height="3" rx="1.5" fill="#0a0a0c" />
        <rect x="21" y="41" width="2.6" height="8" rx="1" fill="#0a0a0c" />
        <rect x="27" y="41" width="2.6" height="8" rx="1" fill="#0a0a0c" />
        <rect x="33" y="41" width="2.6" height="8" rx="1" fill="#0a0a0c" />
      </g>

      {/* Ground mound */}
      <ellipse cx="120" cy="205" rx="84" ry="18" fill="#101014" />
      <ellipse cx="120" cy="202" rx="72" ry="13" fill="#191920" />

      {/* The gravestone, deliberately tilted */}
      <g transform="rotate(-7 108 150)">
        <path
          d="M56 200V96c0-29 24-52 53-52s53 23 53 52v104Z"
          fill="url(#dg-stone)"
          stroke="#43434f"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Inner carved border */}
        <path
          d="M72 194V98c0-20 17-37 37-37s37 17 37 37v96Z"
          fill="none"
          stroke="#0d0d11"
          strokeWidth="2.5"
          opacity="0.8"
        />
        {/* RIP engraving */}
        <text
          x="109"
          y="140"
          textAnchor="middle"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="46"
          fontWeight="700"
          letterSpacing="4"
          fill="#0b0b0e"
        >
          RIP
        </text>
        <text
          x="109"
          y="140"
          textAnchor="middle"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="46"
          fontWeight="700"
          letterSpacing="4"
          fill="#e8e8ee"
          opacity="0.92"
          transform="translate(0 -2)"
        >
          RIP
        </text>
        {/* Small cross detail */}
        <rect x="103" y="158" width="12" height="3" rx="1.5" fill="#5a5a68" />
        <rect x="107.5" y="153.5" width="3" height="12" rx="1.5" fill="#5a5a68" />
        {/* Crack */}
        <path
          d="M136 96l-7 16 9 6-6 14"
          fill="none"
          stroke="#0d0d11"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>

      {/* A little grass */}
      <path d="M52 202c4-9 6-14 5-20" stroke="#1f4d33" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M62 204c2-7 2-11 0-16" stroke="#1f4d33" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M182 203c-4-8-5-13-4-18" stroke="#1f4d33" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

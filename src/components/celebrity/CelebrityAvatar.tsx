import { cn } from '@/lib/utils';
import type { CelebrityAvatar as AvatarSpec } from '@/lib/celebrities/types';

/**
 * ORIGINAL cartoon avatars, drawn from scratch as SVG shapes.
 *
 * These are deliberately simple, goofy caricatures built from circles and
 * curves. They are NOT photographs, NOT traced from photographs, and NOT
 * copies of any logo or copyrighted artwork. Nothing here is intended to
 * be a realistic likeness — the style is closer to a doodle than a portrait,
 * which is exactly what a parody section should look like.
 *
 * No network images are ever loaded, so there is nothing to hotlink and
 * nothing extra to download.
 */

const ACCENT_HEX = {
  alive: '#22e07a',
  dead: '#ff4d5e',
  reborn: '#a06bff',
  legendary: '#ffc94d',
  ghost: '#7fd4ff',
} as const;

export function CelebrityAvatar({
  avatar,
  name,
  className,
  showEmblem = true,
}: {
  avatar: AvatarSpec;
  name: string;
  className?: string;
  showEmblem?: boolean;
}) {
  const accent = ACCENT_HEX[avatar.accent];
  const hooded = avatar.hair === 'hood';
  const uid = `${avatar.hair}-${avatar.accent}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn('shrink-0', className)}
      role="img"
      aria-label={`Cartoon parody avatar of ${name}`}
    >
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={avatar.skin} />
          <stop offset="100%" stopColor={shade(avatar.skin, -18)} />
        </linearGradient>
      </defs>

      {/* Glow behind the head */}
      <circle cx="60" cy="60" r="52" fill={`url(#glow-${uid})`} />

      {/* Headstone-shaped backdrop, tying the avatar to the graveyard */}
      <path
        d="M22 112V54c0-21 17-38 38-38s38 17 38 38v58Z"
        fill="#16161b"
        stroke="#2f2f3a"
        strokeWidth="2"
      />

      {/* Neck + shoulders */}
      <rect x="50" y="80" width="20" height="14" rx="6" fill={shade(avatar.skin, -22)} />
      <path
        d="M32 112c0-13 12-21 28-21s28 8 28 21Z"
        fill={avatar.accessory === 'tie' ? '#22222b' : '#2a2a34'}
      />

      {/* Tie, for the suit-wearers */}
      {avatar.accessory === 'tie' ? (
        <>
          <path d="M60 92l-5 5 5 15 5-15Z" fill={accent} />
          <path d="M56 90h8l-4 5Z" fill={shade(accent, -30)} />
        </>
      ) : null}

      {/* Face */}
      {!hooded ? (
        <ellipse cx="60" cy="62" rx="27" ry="31" fill={`url(#face-${uid})`} />
      ) : (
        <ellipse cx="60" cy="64" rx="24" ry="28" fill="#0c0c10" />
      )}

      {/* Ears */}
      {!hooded ? (
        <>
          <ellipse cx="33" cy="64" rx="5" ry="7" fill={shade(avatar.skin, -12)} />
          <ellipse cx="87" cy="64" rx="5" ry="7" fill={shade(avatar.skin, -12)} />
        </>
      ) : null}

      <Hair style={avatar.hair} color={avatar.hairColor} accent={accent} />

      {/* Eyes — big and cartoonish */}
      {avatar.accessory === 'question' ? (
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill={accent}
          fontFamily="var(--font-display), system-ui, sans-serif"
        >
          ?
        </text>
      ) : (
        <>
          <ellipse cx="50" cy="60" rx="5.4" ry="6.2" fill="#ffffff" />
          <ellipse cx="70" cy="60" rx="5.4" ry="6.2" fill="#ffffff" />
          <circle cx="51" cy="61" r="3" fill="#101014" />
          <circle cx="71" cy="61" r="3" fill="#101014" />
          <circle cx="52.2" cy="59.6" r="1.1" fill="#ffffff" />
          <circle cx="72.2" cy="59.6" r="1.1" fill="#ffffff" />

          {/* Eyebrows */}
          <path
            d="M44 51q6-3.5 12-1"
            stroke={avatar.hairColor}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M64 50q6-2.5 12 1"
            stroke={avatar.hairColor}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nose + grin */}
          <path
            d="M60 64v6"
            stroke={shade(avatar.skin, -35)}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M50 77q10 8 20 0"
            stroke="#3a2a26"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {/* Glasses */}
      {avatar.accessory === 'glasses' || avatar.accessory === 'shades' ? (
        <g
          stroke={avatar.accessory === 'shades' ? '#101014' : '#d8d8e2'}
          strokeWidth="2.4"
          fill={avatar.accessory === 'shades' ? '#101014' : 'none'}
        >
          <rect x="41" y="52" width="18" height="15" rx="5" />
          <rect x="61" y="52" width="18" height="15" rx="5" />
          <path d="M59 59h2" />
        </g>
      ) : null}

      {/* Cap */}
      {avatar.accessory === 'cap' ? (
        <>
          <path d="M30 44a30 30 0 0 1 60 0Z" fill={accent} />
          <rect x="26" y="42" width="46" height="7" rx="3.5" fill={shade(accent, -35)} />
        </>
      ) : null}

      {/* Emblem badge */}
      {showEmblem ? (
        <>
          <circle cx="95" cy="95" r="15" fill="#0c0c10" stroke={accent} strokeWidth="2" />
          <text x="95" y="102" textAnchor="middle" fontSize="16">
            {avatar.emblem}
          </text>
        </>
      ) : null}
    </svg>
  );
}

/** The hairstyles. Each is a handful of simple cartoon shapes. */
function Hair({
  style,
  color,
  accent,
}: {
  style: AvatarSpec['hair'];
  color: string;
  accent: string;
}) {
  switch (style) {
    case 'swoop':
      return (
        <path
          d="M33 52c0-18 12-28 27-28 14 0 24 7 27 20-8-6-17-4-24 1-6 4-13 6-19 3-4-2-8 0-11 4Z"
          fill={color}
        />
      );
    case 'sweep':
      return (
        <>
          <path
            d="M31 50c1-19 14-29 29-29 13 0 24 7 28 18-6 2-9 6-16 5-9-1-13-6-22-4-8 2-13 5-19 10Z"
            fill={color}
          />
          <path
            d="M31 50c8-7 18-11 28-9"
            stroke={shade(color, -25)}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case 'crop':
      return (
        <path
          d="M32 50c0-17 12-27 28-27s28 10 28 27c-5-9-14-13-28-13s-23 4-28 13Z"
          fill={color}
        />
      );
    case 'hood':
      return (
        <>
          <path
            d="M28 108V56c0-19 14-34 32-34s32 15 32 34v52Z"
            fill={color}
            stroke={shade(color, 18)}
            strokeWidth="2"
          />
          <ellipse cx="60" cy="64" rx="24" ry="28" fill="#08080b" />
          <path
            d="M28 108c0-16 8-26 14-30M92 108c0-16-8-26-14-30"
            stroke={shade(color, 14)}
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="60" cy="26" r="3" fill={accent} opacity="0.8" />
        </>
      );
    case 'bowl':
      return (
        <path
          d="M31 58c0-21 13-34 29-34s29 13 29 34c-4-14-13-20-29-20s-25 6-29 20Z"
          fill={color}
        />
      );
    case 'slick':
      return (
        <>
          <path
            d="M32 49c2-16 13-25 28-25s26 9 28 25c-7-8-16-11-28-11s-21 3-28 11Z"
            fill={color}
          />
          <path
            d="M44 40q16-6 32 2"
            stroke={shade(color, 22)}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case 'curls':
      return (
        <g fill={color}>
          <circle cx="42" cy="42" r="12" />
          <circle cx="60" cy="34" r="13" />
          <circle cx="78" cy="42" r="12" />
          <circle cx="50" cy="32" r="10" />
          <circle cx="70" cy="32" r="10" />
          <circle cx="34" cy="53" r="9" />
          <circle cx="86" cy="53" r="9" />
        </g>
      );
    case 'flat':
    default:
      return (
        <path
          d="M32 52c0-18 12-28 28-28s28 10 28 28c-3-8-6-12-10-12H42c-4 0-7 4-10 12Z"
          fill={color}
        />
      );
  }
}

/** Lightens or darkens a hex colour by a percentage. */
function shade(hex: string, percent: number): string {
  const clean = hex.replace('#', '');
  const num = Number.parseInt(
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean,
    16,
  );
  const amount = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

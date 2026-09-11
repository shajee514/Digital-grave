import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Compact gravestone mark used in the navbar and footer. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('h-8 w-8', className)}
      role="img"
      aria-label="Digital Grave logo: a tilted gravestone engraved RIP"
    >
      <defs>
        <linearGradient id="dg-mark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a46" />
          <stop offset="100%" stopColor="#16161b" />
        </linearGradient>
      </defs>
      {/* Skull behind */}
      <g transform="translate(24 5) rotate(10)">
        <path
          d="M0 7c0-4 4-7 8-7s8 3 8 7c0 3-1 4-3 6v3c0 1-1 2-2 2H5c-1 0-2-1-2-2v-3C1 11 0 10 0 7Z"
          fill="#c2c2cf"
        />
        <circle cx="5" cy="7" r="2.2" fill="#0a0a0c" />
        <circle cx="11" cy="7" r="2.2" fill="#0a0a0c" />
      </g>
      {/* Stone */}
      <g transform="rotate(-8 18 24)">
        <path
          d="M8 34V17c0-5.5 4.5-10 10-10s10 4.5 10 10v17Z"
          fill="url(#dg-mark)"
          stroke="#4a4a58"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <text
          x="18"
          y="26"
          textAnchor="middle"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="10"
          fontWeight="700"
          letterSpacing="0.5"
          fill="#e8e8ee"
        >
          RIP
        </text>
      </g>
      <ellipse cx="20" cy="35" rx="15" ry="2.6" fill="#101014" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group flex items-center gap-2.5 transition-opacity hover:opacity-90',
        className,
      )}
      aria-label="Digital Grave — home"
    >
      <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-display text-sm font-bold tracking-[0.14em] text-bone">
          DIGITAL GRAVE
        </span>
        <span className="mt-1 font-mono text-[0.6rem] tracking-[0.2em] text-alive">
          $RIP
        </span>
      </span>
    </Link>
  );
}

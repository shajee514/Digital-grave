/**
 * The animated cemetery scene behind the Celebrity Graveyard hero.
 *
 * Built from plain SVG and CSS animations — no image files and no
 * animation library, so it costs almost nothing to load. It is decorative
 * only, so it is hidden from screen readers, and it holds still for anyone
 * who has asked for reduced motion.
 */
export function CemeteryBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Coloured haze */}
      <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-reborn/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-48 w-96 rounded-full bg-alive/10 blur-3xl" />

      {/* Drifting fog banks */}
      <div className="absolute inset-x-0 bottom-16 h-24 animate-fog bg-gradient-to-r from-transparent via-bone/[0.05] to-transparent blur-xl" />
      <div
        className="absolute inset-x-0 bottom-4 h-20 animate-fog bg-gradient-to-r from-transparent via-bone/[0.04] to-transparent blur-xl"
        style={{ animationDelay: '-9s', animationDuration: '26s' }}
      />

      {/* Floating ghosts */}
      <Ghost className="left-[8%] top-[22%] h-10 w-10 text-ghost/45" delay="0s" />
      <Ghost className="right-[12%] top-[16%] h-8 w-8 text-bone/30" delay="-2.5s" />
      <Ghost className="left-[42%] top-[10%] h-7 w-7 text-reborn/40" delay="-4.5s" />
      <Ghost className="right-[28%] bottom-[34%] h-9 w-9 text-alive/30" delay="-6s" />

      {/* Twinkling skulls */}
      <span className="absolute left-[22%] top-[34%] animate-pulse-glow text-lg opacity-25">💀</span>
      <span
        className="absolute right-[8%] top-[46%] animate-pulse-glow text-base opacity-20"
        style={{ animationDelay: '-1.4s' }}
      >
        💀
      </span>

      {/* The skyline of gravestones along the bottom */}
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-32 w-full"
      >
        <g fill="#101014" stroke="#22222b" strokeWidth="2">
          {STONES.map((stone) => (
            <Headstone key={stone.x} {...stone} />
          ))}
        </g>
        {/* The ground */}
        <path d="M0 148h1200v14H0Z" fill="#0a0a0c" stroke="none" />
        <path d="M0 148q300-16 600 0t600 0v14H0Z" fill="#141419" stroke="none" />
      </svg>
    </div>
  );
}

const STONES = [
  { x: 60, w: 54, h: 74, tilt: -5, cross: true },
  { x: 172, w: 40, h: 52, tilt: 3, cross: false },
  { x: 268, w: 62, h: 90, tilt: -2, cross: true },
  { x: 396, w: 44, h: 60, tilt: 6, cross: false },
  { x: 500, w: 56, h: 78, tilt: -3, cross: true },
  { x: 630, w: 38, h: 48, tilt: 4, cross: false },
  { x: 726, w: 60, h: 86, tilt: -4, cross: true },
  { x: 856, w: 42, h: 58, tilt: 2, cross: false },
  { x: 956, w: 58, h: 80, tilt: -6, cross: true },
  { x: 1084, w: 46, h: 62, tilt: 3, cross: false },
];

function Headstone({
  x,
  w,
  h,
  tilt,
  cross,
}: {
  x: number;
  w: number;
  h: number;
  tilt: number;
  cross: boolean;
}) {
  const top = 150 - h;
  return (
    <g transform={`rotate(${tilt} ${x + w / 2} 150)`}>
      <path
        d={`M${x} 150V${top + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V150Z`}
      />
      {cross ? (
        <g stroke="#2c2c37" strokeWidth="3" strokeLinecap="round">
          <path d={`M${x + w / 2 - 8} ${top + 26}h16`} />
          <path d={`M${x + w / 2} ${top + 18}v16`} />
        </g>
      ) : null}
    </g>
  );
}

function Ghost({ className, delay }: { className: string; delay: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      className={`absolute animate-ghost ${className}`}
      style={{ animationDelay: delay }}
      fill="currentColor"
    >
      <path d="M20 2c9.4 0 17 7.6 17 17v25c0 2-2.4 3-3.8 1.6L29 41.4l-4.2 4.2a2.6 2.6 0 0 1-3.7 0L17 41.4l-4.2 4.2A2.6 2.6 0 0 1 8.3 44l-4.2-4.2C2.7 41.2 3 44 3 42V19C3 9.6 10.6 2 20 2Z" />
      <circle cx="14" cy="19" r="3.2" fill="#0a0a0c" />
      <circle cx="26" cy="19" r="3.2" fill="#0a0a0c" />
      <ellipse cx="20" cy="27" rx="3" ry="2" fill="#0a0a0c" opacity="0.7" />
    </svg>
  );
}

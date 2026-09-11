import { ImageResponse } from 'next/og';
import { site } from '@/lib/config/site';

export const runtime = 'nodejs';
export const alt = 'Digital Grave — $RIP — Buy. Hold. Live. Sell. Die.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(160deg, #121216 0%, #0a0a0c 55%, #050506 100%)',
          color: '#e8e8ee',
          fontFamily: 'sans-serif',
        }}
      >
        <span style={{ fontSize: 110 }}>🪦</span>
        <span
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2,
            marginTop: 16,
          }}
        >
          {site.name}
        </span>
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#22e07a',
            letterSpacing: 6,
            marginTop: 10,
          }}
        >
          {site.ticker}
        </span>
        <span
          style={{
            fontSize: 34,
            color: '#8b8b99',
            letterSpacing: 3,
            marginTop: 26,
          }}
        >
          {site.slogan}
        </span>
      </div>
    ),
    size,
  );
}

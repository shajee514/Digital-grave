import { ImageResponse } from 'next/og';
import { dataSource } from '@/lib/data';
import {
  formatDate,
  formatGraveNumber,
  formatLifespan,
  shortAddress,
} from '@/lib/domain/format';

/**
 * The downloadable / shareable grave image.
 *
 * Only the grave number, dates, lifespan and the SHORTENED wallet address
 * are drawn. The full address never appears in the image.
 */
export const runtime = 'nodejs';
export const alt = 'Digital Grave — $RIP';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function GraveOgImage({
  params,
}: {
  params: Promise<{ graveNumber: string }>;
}) {
  const { graveNumber } = await params;
  const parsed = Number.parseInt(graveNumber, 10);

  let grave = null;
  try {
    grave = Number.isFinite(parsed) ? await dataSource.getGraveByNumber(parsed) : null;
  } catch {
    grave = null;
  }

  const label = grave ? formatGraveNumber(grave.graveNumber) : '#??????';
  const cause = grave ? grave.causeOfDeath : 'UNKNOWN';
  const lifespan = grave ? formatLifespan(grave.lifespanSeconds) : '—';
  const wallet = grave ? shortAddress(grave.walletAddress) : '0x...';
  const born = grave ? formatDate(grave.bornAt) : '—';
  const died = grave ? formatDate(grave.diedAt) : '—';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(160deg, #121216 0%, #0a0a0c 55%, #050506 100%)',
          padding: 64,
          color: '#e8e8ee',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, letterSpacing: 6, color: '#8b8b99' }}>
              DIGITAL GRAVE
            </span>
            <span style={{ fontSize: 64, fontWeight: 700, marginTop: 8 }}>
              GRAVE {label}
            </span>
          </div>
          <span style={{ fontSize: 84 }}>🪦</span>
        </div>

        {/* Cause of death */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderTop: '2px solid #26262f',
            borderBottom: '2px solid #26262f',
            padding: '34px 0',
          }}
        >
          <span style={{ fontSize: 22, letterSpacing: 6, color: '#8b8b99' }}>
            CAUSE OF DEATH
          </span>
          <span
            style={{
              fontSize: 82,
              fontWeight: 700,
              color: '#ff4d5e',
              marginTop: 10,
              letterSpacing: -1,
            }}
          >
            {cause}
          </span>
        </div>

        {/* Details */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 48,
          }}
        >
          <div style={{ display: 'flex', gap: 44, flexShrink: 1 }}>
            {[
              { label: 'WALLET', value: wallet },
              { label: 'BORN', value: born },
              { label: 'DIED', value: died },
              { label: 'LIFESPAN', value: lifespan },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 18, letterSpacing: 4, color: '#8b8b99' }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    marginTop: 8,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 700, color: '#22e07a', letterSpacing: 2 }}>
              $RIP
            </span>
            <span style={{ fontSize: 18, color: '#8b8b99', marginTop: 6 }}>
              Everyone dies.
            </span>
            <span style={{ fontSize: 18, color: '#8b8b99' }}>
              Paper hands die first.
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

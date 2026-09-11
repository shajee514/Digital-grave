import { ImageResponse } from 'next/og';
import { getCelebrityBySlug } from '@/lib/celebrities/source';
import { formatGraveNumber } from '@/lib/domain/format';

/**
 * The social preview image for a celebrity parody grave.
 *
 * The words FICTIONAL PARODY are burned into the image itself, so the
 * label travels with the picture even when someone re-posts it without
 * the link or the caption.
 */
export const runtime = 'nodejs';
export const alt = 'Digital Grave — fictional parody grave';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function CelebrityOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const celebrity = getCelebrityBySlug(slug);

  const name = celebrity ? celebrity.displayName : 'UNKNOWN';
  const title = celebrity ? celebrity.title : '🪦 NOT IN THE CEMETERY';
  const cause = celebrity ? celebrity.causeOfDeath : 'UNKNOWN';
  const achievement = celebrity ? celebrity.achievement : '—';
  const graveNumber = celebrity ? formatGraveNumber(celebrity.graveNumber) : '#??????';
  const emblem = celebrity ? celebrity.avatar.emblem : '🪦';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(160deg, #121216 0%, #0a0a0c 55%, #050506 100%)',
          padding: 60,
          color: '#e8e8ee',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 20, letterSpacing: 6, color: '#8b8b99' }}>
              DIGITAL GRAVE · CELEBRITY GRAVEYARD
            </span>
            <span style={{ fontSize: 66, fontWeight: 700, marginTop: 10 }}>
              {name}
            </span>
            <span style={{ fontSize: 30, color: '#a06bff', marginTop: 8 }}>
              {title}
            </span>
          </div>

          {/* The parody label, impossible to crop out of the meaning */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '3px solid #ffc94d',
              borderRadius: 14,
              padding: '10px 18px',
            }}
          >
            <span style={{ fontSize: 46 }}>{emblem}</span>
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 3,
                color: '#ffc94d',
                marginTop: 4,
              }}
            >
              FICTIONAL PARODY
            </span>
          </div>
        </div>

        {/* Cause of death */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderTop: '2px solid #26262f',
            borderBottom: '2px solid #26262f',
            padding: '28px 0',
          }}
        >
          <span style={{ fontSize: 20, letterSpacing: 6, color: '#8b8b99' }}>
            FICTIONAL CAUSE OF DEATH
          </span>
          <span
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: '#ff4d5e',
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            {cause}
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 40,
          }}
        >
          <div style={{ display: 'flex', gap: 52 }}>
            {[
              { label: 'ACHIEVEMENT', value: achievement },
              { label: 'GRAVE', value: graveNumber },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <span style={{ fontSize: 17, letterSpacing: 4, color: '#8b8b99' }}>
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
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: '#22e07a',
                letterSpacing: 2,
              }}
            >
              $RIP
            </span>
            <span style={{ fontSize: 16, color: '#8b8b99', marginTop: 6 }}>
              Parody. Not affiliated with,
            </span>
            <span style={{ fontSize: 16, color: '#8b8b99' }}>
              or endorsed by, anyone.
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

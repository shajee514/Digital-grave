import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Panel, SectionHeading, Stat } from '@/components/ui/Panel';
import { GraveCard } from '@/components/grave/GraveCard';
import { ShareActions } from '@/components/grave/ShareActions';
import { ErrorState } from '@/components/ui/States';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { dataSource, NotConfiguredError } from '@/lib/data';
import { graveShareText, absoluteUrl } from '@/lib/share';
import { causeFlavour } from '@/lib/domain/causes';
import {
  formatDateTime,
  formatGraveNumber,
  formatLifespan,
  shortAddress,
} from '@/lib/domain/format';
import { ERROR_MESSAGES } from '@/lib/domain/copy';
import type { GraveyardEntry } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ graveNumber: string }> };

async function loadGrave(raw: string): Promise<GraveyardEntry | null> {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  try {
    return await dataSource.getGraveByNumber(parsed);
  } catch (error) {
    if (error instanceof NotConfiguredError) return null;
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { graveNumber } = await params;
  const grave = await loadGrave(graveNumber);

  if (!grave) {
    return { title: 'Grave not found', robots: { index: false, follow: false } };
  }

  const title = `Grave ${formatGraveNumber(grave.graveNumber)} — ${grave.causeOfDeath}`;
  const description = `Wallet ${shortAddress(grave.walletAddress)} held $RIP for ${formatLifespan(grave.lifespanSeconds)}. Cause of death: ${grave.causeOfDeath}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function GravePage({ params }: Params) {
  const { graveNumber } = await params;
  const grave = await loadGrave(graveNumber);

  if (!grave) {
    return (
      <Container className="py-16">
        <ErrorState
          emoji="🕳️"
          title="Empty plot"
          message={`${ERROR_MESSAGES.noHistory} No grave exists with that number.`}
          action={
            <ButtonLink href="/graveyard" variant="secondary" size="md" className="mt-4">
              BROWSE THE GRAVEYARD
            </ButtonLink>
          }
        />
      </Container>
    );
  }

  const shareUrl = absoluteUrl(`/grave/${grave.graveNumber}`);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={grave.status === 'RESURRECTED' ? 'reborn' : 'dead'}>
          {grave.status === 'RESURRECTED' ? '⚡ Later resurrected' : '🪦 Buried'}
        </Badge>
      </div>

      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        GRAVE {formatGraveNumber(grave.graveNumber)}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">
        {causeFlavour(grave.causeOfDeath)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
        <div>
          <GraveCard
            grave={grave}
            isDemo={grave.isDemo}
            linkToGrave={false}
          />
          <ShareActions
            className="mt-4"
            shareUrl={shareUrl}
            shareText={graveShareText(grave)}
            imageUrl={`/grave/${grave.graveNumber}/opengraph-image`}
            imageFileName={`digital-grave-${formatGraveNumber(grave.graveNumber).slice(1)}.png`}
          />
        </div>

        <div className="space-y-4">
          <Panel>
            <SectionHeading title="Record" eyebrow="Public details" />
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <Stat
                label="Cause of Death"
                value={<span className="text-dead">{grave.causeOfDeath}</span>}
              />
              <Stat label="Lifespan" value={formatLifespan(grave.lifespanSeconds)} />
              <Stat
                label="Born"
                value={<span className="text-xl">{formatDateTime(grave.bornAt)}</span>}
              />
              <Stat
                label="Died"
                value={<span className="text-xl">{formatDateTime(grave.diedAt)}</span>}
              />
              <Stat
                label="Wallet Deaths"
                value={grave.totalDeathsForWallet}
                sub="Total graves belonging to this wallet"
              />
              <Stat
                label="Resurrection"
                value={
                  grave.status === 'RESURRECTED'
                    ? 'Returned after this death'
                    : 'Has not returned'
                }
                valueClass={
                  grave.status === 'RESURRECTED'
                    ? 'text-reborn text-xl'
                    : 'text-ash text-xl'
                }
              />
            </dl>
          </Panel>

          <Panel>
            <p className="text-sm text-ash">
              This grave belongs to wallet{' '}
              <span className="font-mono text-bone">
                {shortAddress(grave.walletAddress)}
              </span>
              .
            </p>
            <Link
              href={`/wallet/${grave.walletAddress}`}
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-alive transition-opacity hover:opacity-80"
            >
              View the full wallet story →
            </Link>
          </Panel>

          <p className="px-1 text-xs leading-relaxed text-ash/70">
            The cause of death is a joke generated from how long the position was
            held. It is not a claim about anyone&apos;s intentions, and it says
            nothing about profit or loss.
          </p>
        </div>
      </div>
    </Container>
  );
}

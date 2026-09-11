import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Panel, SectionHeading, Stat } from '@/components/ui/Panel';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShareActions } from '@/components/grave/ShareActions';
import { CelebrityAvatar } from '@/components/celebrity/CelebrityAvatar';
import { CelebrityCard } from '@/components/celebrity/CelebrityCard';
import { ParodyDisclaimer, ParodyTag } from '@/components/celebrity/ParodyDisclaimer';
import { CemeteryBackground } from '@/components/celebrity/CemeteryBackground';
import {
  getAllCelebrities,
  getCelebrityBySlug,
  celebrityShareText,
} from '@/lib/celebrities/source';
import { absoluteUrl } from '@/lib/share';
import { formatGraveNumber } from '@/lib/domain/format';
import { site } from '@/lib/config/site';
import { cn } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

/**
 * The roster is a fixed list, so only these slugs exist. Anything else is a
 * genuine 404 rather than a page that merely looks like one.
 */
export const dynamicParams = false;

/** Every profile is pre-rendered at build time for speed. */
export function generateStaticParams() {
  return getAllCelebrities().map((celebrity) => ({ slug: celebrity.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const celebrity = getCelebrityBySlug(slug);

  if (!celebrity) {
    return { title: 'Grave not found', robots: { index: false, follow: false } };
  }

  // The title always carries the parody label, so a search result or a
  // shared link can never look like a real news story.
  const title = `${celebrity.displayName} — Digital Grave | Fictional Parody`;
  const description = `A fictional parody grave for ${celebrity.displayName}. ${celebrity.title}. Invented cause of death: ${celebrity.causeOfDeath}. Parody content, not affiliated with or endorsed by anyone.`;

  return {
    // `absolute` stops the site-wide title template appending the brand name
    // a second time, since this title already carries it.
    title: { absolute: title },
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const ACCENT = {
  alive: { text: 'text-alive', border: 'border-alive/30', glow: 'bg-alive/10' },
  dead: { text: 'text-dead', border: 'border-dead/30', glow: 'bg-dead/10' },
  reborn: { text: 'text-reborn', border: 'border-reborn/30', glow: 'bg-reborn/10' },
  legendary: {
    text: 'text-legendary',
    border: 'border-legendary/30',
    glow: 'bg-legendary/10',
  },
  ghost: { text: 'text-ghost', border: 'border-ghost/30', glow: 'bg-ghost/10' },
} as const;

export default async function CelebrityProfilePage({ params }: Params) {
  const { slug } = await params;
  const celebrity = getCelebrityBySlug(slug);

  if (!celebrity) notFound();

  const accent = ACCENT[celebrity.avatar.accent];
  const shareUrl = absoluteUrl(`/celebrities/${celebrity.slug}`);
  const others = getAllCelebrities()
    .filter((c) => c.slug !== celebrity.slug)
    .slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-moss/50">
        <CemeteryBackground />

        <Container className="relative py-10 sm:py-14">
          <Link
            href="/celebrities"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:text-bone"
          >
            ← Celebrity Graveyard
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            {/* Portrait */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className={cn(
                    'absolute inset-0 rounded-full blur-3xl',
                    accent.glow,
                  )}
                  aria-hidden
                />
                <CelebrityAvatar
                  avatar={celebrity.avatar}
                  name={celebrity.name}
                  className="relative h-56 w-56 animate-float sm:h-64 sm:w-64"
                />
              </div>
            </div>

            {/* Identity */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ash">
                  🪦 {site.name}
                </span>
                <ParodyTag />
              </div>

              <h1 className="engraved mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
                {celebrity.name}
              </h1>

              <p className={cn('mt-3 font-display text-lg font-bold', accent.text)}>
                {celebrity.title}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge tone={celebrity.avatar.accent}>{celebrity.status}</Badge>
                <Badge tone="neutral">{celebrity.category}</Badge>
                <Badge tone="legendary">
                  GRAVE {formatGraveNumber(celebrity.graveNumber)}
                </Badge>
              </div>

              <div className="mt-7">
                <p className="label-caps mb-2">Share this grave</p>
                <ShareActions
                  shareUrl={shareUrl}
                  shareText={celebrityShareText(celebrity)}
                  imageUrl={`/celebrities/${celebrity.slug}/opengraph-image`}
                  imageFileName={`digital-grave-${celebrity.slug}.png`}
                  showCopyText
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <ParodyDisclaimer />

        {/* The record */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel className={cn('border', accent.border)}>
            <span className="label-caps">Fictional Cause of Death</span>
            <p
              className={cn(
                'engraved mt-3 font-display text-2xl font-bold uppercase leading-tight sm:text-3xl',
                accent.text,
              )}
            >
              {celebrity.causeOfDeath}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ash">
              Invented for comedy. This does not describe any real event, and
              nobody featured in this section is dead.
            </p>
          </Panel>

          <Panel>
            <span className="label-caps">Fictional Last Words</span>
            <p className="mt-3 font-display text-xl italic leading-snug text-bone sm:text-2xl">
              &ldquo;{celebrity.lastWords}&rdquo;
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ash">
              Written by us as a joke. This is not a real quote and was never
              said by anyone.
            </p>
          </Panel>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Panel className="p-4">
            <Stat
              label="Achievement"
              value={<span className="text-lg text-legendary">{celebrity.achievement}</span>}
            />
          </Panel>
          <Panel className="p-4">
            <Stat
              label="Grave Number"
              value={formatGraveNumber(celebrity.graveNumber)}
            />
          </Panel>
          <Panel className="p-4">
            <Stat
              label="Status"
              value={<span className="text-lg">{celebrity.status}</span>}
            />
          </Panel>
          <Panel className="p-4">
            <Stat
              label="Immortality"
              value={`${celebrity.stats.immortality}%`}
              sub="Made-up score"
            />
          </Panel>
        </div>

        {/* Biography */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Completely made up"
            title="The fictional biography"
          />
          <Panel className="mt-6">
            <div className="space-y-3">
              {celebrity.description.map((line) => (
                <p key={line} className="text-base leading-relaxed text-bone">
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-5 border-t border-moss/60 pt-4 text-xs leading-relaxed text-ash">
              This biography is fiction written for entertainment. It is not a
              record of anyone&apos;s life, career or actions.
            </p>
          </Panel>
        </section>

        {/* More graves */}
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Keep digging" title="More fictional graves" />
            <ButtonLink href="/celebrities" variant="secondary" size="sm">
              VIEW ALL
            </ButtonLink>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <CelebrityCard key={other.id} celebrity={other} />
            ))}
          </div>
        </section>

        <ParodyDisclaimer className="mt-12" />
      </Container>
    </>
  );
}

import type { Metadata } from 'next';
import { Container, SectionHeading } from '@/components/ui/Panel';
import { ButtonLink } from '@/components/ui/Button';
import { CemeteryBackground } from '@/components/celebrity/CemeteryBackground';
import { CelebrityExplorer } from '@/components/celebrity/CelebrityExplorer';
import { CelebrityLeaderboard } from '@/components/celebrity/CelebrityLeaderboard';
import { ParodyDisclaimer } from '@/components/celebrity/ParodyDisclaimer';
import { getAllCelebrities, CELEBRITY_BOARDS } from '@/lib/celebrities/source';
import type { CelebrityBoard } from '@/lib/celebrities/source';

export const metadata: Metadata = {
  title: 'Celebrity Graveyard — Fictional Parody',
  description:
    'A fictional parody cemetery for famous names. 100% fictional. 100% parody. 0% official.',
  openGraph: {
    title: 'Celebrity Graveyard — Digital Grave | Fictional Parody',
    description:
      'Famous. Powerful. Immortal... until the cemetery says otherwise. Fictional parody content.',
    type: 'website',
  },
};

const VALID_BOARDS = new Set(CELEBRITY_BOARDS.map((b) => b.key));

export default async function CelebritiesPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { board: rawBoard } = await searchParams;
  const board = (
    VALID_BOARDS.has((rawBoard ?? '') as CelebrityBoard) ? rawBoard : 'most-immortal'
  ) as CelebrityBoard;

  const celebrities = getAllCelebrities();

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-moss/50">
        <CemeteryBackground />

        <Container className="relative py-16 sm:py-24">
          <div className="flex flex-col items-center text-center">
            <span className="animate-fade-in rounded-full border border-legendary/30 bg-legendary/[0.07] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-legendary">
              100% fictional · 100% parody · 0% official
            </span>

            <h1 className="mt-6 animate-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              <span aria-hidden>🪦</span> CELEBRITY
              <br />
              <span className="bg-gradient-to-br from-bone via-bone to-ash bg-clip-text text-transparent">
                GRAVEYARD
              </span>
            </h1>

            <p className="mt-5 max-w-xl animate-fade-up text-sm leading-relaxed text-ash sm:text-base">
              Famous. Powerful. Immortal... until the cemetery says otherwise.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-up">
              <ButtonLink href="#graves" variant="reborn" size="lg">
                ENTER THE CEMETERY
              </ButtonLink>
              <ButtonLink href="/search" variant="secondary" size="lg">
                SEARCH A REAL WALLET
              </ButtonLink>
            </div>

            <ParodyDisclaimer className="mt-10 max-w-2xl text-left" />
          </div>
        </Container>
      </section>

      {/* ---------- The roster ---------- */}
      <Container className="py-14" id="graves">
        <SectionHeading
          eyebrow={`${celebrities.length} fictional graves`}
          title="The residents"
          subtitle="Every profile below is an invented joke. Nobody here is dead, nobody endorses this project, and no real quotes or events appear anywhere in this section."
        />

        <div className="mt-8">
          <CelebrityExplorer celebrities={celebrities} />
        </div>
      </Container>

      {/* ---------- Leaderboard ---------- */}
      <Container className="py-14" id="leaderboard">
        <SectionHeading
          eyebrow="For entertainment only"
          title={<><span aria-hidden>🏆</span> CELEBRITY GRAVE LEADERBOARD</>}
          subtitle="Made-up rankings for made-up graves."
        />

        <div className="mt-8">
          <CelebrityLeaderboard board={board} />
        </div>
      </Container>

      {/* ---------- Back to the real product ---------- */}
      <Container className="py-14">
        <div className="stone-panel flex flex-col items-center gap-5 px-6 py-12 text-center">
          <span className="text-4xl" aria-hidden>
            🪦
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Enough jokes. What about your wallet?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ash">
            The real cemetery runs on actual blockchain records. Look up any
            public wallet and find out whether it is alive, dead or resurrected.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/search" size="lg">
              SEARCH A WALLET
            </ButtonLink>
            <ButtonLink href="/graveyard" variant="secondary" size="lg">
              THE REAL GRAVEYARD
            </ButtonLink>
          </div>
        </div>

        <ParodyDisclaimer className="mt-8" />
      </Container>
    </>
  );
}

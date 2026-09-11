import { CelebrityCard } from '@/components/celebrity/CelebrityCard';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/Panel';
import { ParodyTag } from '@/components/celebrity/ParodyDisclaimer';
import { getFeaturedCelebrities } from '@/lib/celebrities/source';

/**
 * The homepage teaser for the Celebrity Graveyard.
 *
 * Sits below the wallet-search features on purpose — it is a fun side
 * attraction, not the main product, so it must never compete with the
 * wallet search at the top of the page.
 */
export function FamousGraves() {
  const featured = getFeaturedCelebrities(3);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow={
            <span className="inline-flex items-center gap-2">
              Just for laughs <ParodyTag />
            </span>
          }
          title={<><span aria-hidden>🪦</span> FAMOUS PEOPLE HAVE GRAVES TOO</>}
          subtitle="Think your favourite celebrity can escape the cemetery? These profiles are fictional parody content — invented jokes, not real people's records."
        />
        <ButtonLink href="/celebrities" variant="secondary" size="sm">
          ENTER CELEBRITY GRAVEYARD →
        </ButtonLink>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((celebrity) => (
          <CelebrityCard key={celebrity.id} celebrity={celebrity} />
        ))}
      </div>
    </>
  );
}

import { Container } from '@/components/ui/Panel';
import { ButtonLink } from '@/components/ui/Button';
import { Gravestone } from '@/components/brand/Gravestone';
import { ERROR_MESSAGES } from '@/lib/domain/copy';

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-20 text-center">
      <Gravestone className="h-56 w-56" accent="dead" />
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-3 max-w-sm text-sm text-ash">{ERROR_MESSAGES.notFound}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="md">
          BACK TO THE SURFACE
        </ButtonLink>
        <ButtonLink href="/graveyard" variant="secondary" size="md">
          ENTER THE GRAVEYARD
        </ButtonLink>
      </div>
    </Container>
  );
}

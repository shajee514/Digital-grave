'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Panel';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ERROR_MESSAGES } from '@/lib/domain/copy';

/**
 * Friendly catch-all error screen.
 * The raw technical error is never shown to a normal visitor.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <span className="text-5xl" aria-hidden>
        💀
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
        Something died in here
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ash">{ERROR_MESSAGES.generic}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>TRY AGAIN</Button>
        <ButtonLink href="/" variant="secondary">
          BACK HOME
        </ButtonLink>
      </div>
    </Container>
  );
}

import { Container, SectionHeading } from '@/components/ui/Panel';
import type { ReactNode } from 'react';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading eyebrow={`Last updated ${updated}`} title={title} />
      <div className="mt-8 max-w-3xl space-y-6 text-sm leading-relaxed text-ash [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-bone [&_li]:ml-4 [&_strong]:text-bone [&_ul]:space-y-2">
        {children}
      </div>
    </Container>
  );
}

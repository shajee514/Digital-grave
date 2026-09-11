import { Container } from '@/components/ui/Panel';
import { LoadingMessage } from '@/components/ui/States';
import { ListSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <Container className="py-16">
      <div className="mb-8 text-center">
        <LoadingMessage />
      </div>
      <ListSkeleton rows={5} />
    </Container>
  );
}

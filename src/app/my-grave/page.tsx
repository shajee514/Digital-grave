import type { Metadata } from 'next';
import { MyGraveClient } from '@/components/wallet/MyGraveClient';

export const metadata: Metadata = {
  title: 'My Grave',
  description: 'Connect your wallet to see your own $RIP life story. Connecting is optional.',
  robots: { index: false, follow: true },
};

export default function MyGravePage() {
  return <MyGraveClient />;
}

import type { Metadata } from 'next';
import { Container, Panel, SectionHeading } from '@/components/ui/Panel';
import { WalletSearch } from '@/components/wallet/WalletSearch';
import { StateShowcase } from '@/components/home/StateShowcase';
import { Gravestone } from '@/components/brand/Gravestone';

export const metadata: Metadata = {
  title: 'Search a wallet',
  description:
    'Look up any public wallet address and see its $RIP life story. No wallet connection required.',
};

export default function SearchPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="No connection needed"
            title="Search any wallet"
            subtitle="Paste any public wallet address. You do not need to connect your own wallet, sign anything, or create an account."
          />

          <div className="mt-8">
            <WalletSearch size="lg" autoFocus />
          </div>

          <Panel className="mt-6">
            <h2 className="label-caps">What you will never be asked for</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ash">
              <li>❌ Your seed phrase or recovery words</li>
              <li>❌ Your private key</li>
              <li>❌ Your wallet or exchange password</li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-ash/70">
              Anyone asking you for these is trying to steal from you. This site
              reads public blockchain data only.
            </p>
          </Panel>
        </div>

        <div className="flex justify-center">
          <Gravestone className="h-64 w-64 sm:h-80 sm:w-80" accent="ghost" />
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Possible answers"
          title="What the cemetery can tell you"
        />
        <div className="mt-8">
          <StateShowcase />
        </div>
      </section>
    </Container>
  );
}

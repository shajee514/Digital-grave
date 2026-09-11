import type { Metadata } from 'next';
import { Container, Panel, SectionHeading } from '@/components/ui/Panel';
import { ButtonLink } from '@/components/ui/Button';
import { WalletSearch } from '@/components/wallet/WalletSearch';
import { LifeCycle } from '@/components/home/LifeCycle';
import { SURVIVAL_LEVELS } from '@/lib/domain/levels';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Find a wallet, see its $RIP history, hold to survive, sell to get a grave, buy again to resurrect.',
};

const STEPS = [
  {
    emoji: '🔍',
    title: 'Find a wallet',
    body: 'Paste any public wallet address into the search box. You do not need to connect a wallet or make an account.',
  },
  {
    emoji: '📜',
    title: 'See its $RIP history',
    body: 'The site reads public blockchain records and shows every buy, sell and transfer for that wallet.',
  },
  {
    emoji: '💸',
    title: 'Buy and become ALIVE',
    body: 'The moment a wallet holds $RIP, a life begins and the survival timer starts counting.',
  },
  {
    emoji: '🤲',
    title: 'Hold to increase survival',
    body: 'The longer the position is held without selling out, the higher the cosmetic survival level climbs.',
  },
  {
    emoji: '🪦',
    title: 'Sell and receive a grave',
    body: 'Selling the entire position ends that life. A numbered grave is created with a funny cause of death.',
  },
  {
    emoji: '⚡',
    title: 'Buy again to RESURRECT',
    body: 'Buying back in after dying starts a brand new life. Old graves stay in the cemetery forever.',
  },
  {
    emoji: '🎖️',
    title: 'Earn survival achievements',
    body: 'Badges and levels are bragging rights only. They are worth exactly zero money.',
  },
];

const FAQ = [
  {
    q: 'Do I have to connect my wallet?',
    a: 'No. Searching wallets, browsing graves, the leaderboard and every public page work with no connection at all. Connecting is optional and only powers your personal "My Grave" page.',
  },
  {
    q: 'Is sending tokens to a friend the same as selling?',
    a: 'No, and we treat it differently. A plain wallet-to-wallet transfer is labelled TRANSFER, not SELL, and it does not create a grave. Only a sale through a known exchange address counts as a death.',
  },
  {
    q: 'How is the cause of death decided?',
    a: 'It is a joke picked from how long the position was held, using a fixed rule so the same grave always shows the same cause. It is not a claim about what anyone was thinking or whether they made money.',
  },
  {
    q: 'Are the achievements worth anything?',
    a: 'No. Levels, badges and graves are cosmetic. They carry no financial value, no ownership and no entitlement of any kind.',
  },
  {
    q: 'Will you ever ask for my seed phrase?',
    a: 'Never. Not for any reason. Anyone who asks you for a seed phrase, private key or password is trying to rob you, no matter who they claim to be.',
  },
];

export default function HowItWorksPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Simple version"
        title="How it works"
        subtitle="Every wallet has a story. This site reads public blockchain records and turns them into one."
      />

      <div className="mt-10">
        <LifeCycle />
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Panel className="h-full">
              <div className="flex items-start gap-4">
                <span className="text-2xl" aria-hidden>
                  {step.emoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ash">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-lg font-bold tracking-tight">
                      {step.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{step.body}</p>
                </div>
              </div>
            </Panel>
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Cosmetic only"
          title="Survival levels"
          subtitle="Based on the length of your current unbroken life."
        />
        <div className="mt-6 space-y-3">
          {SURVIVAL_LEVELS.map((level) => (
            <div
              key={level.level}
              className="stone-panel flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className={cn('font-display text-base font-bold', level.colorClass)}>
                  {level.level}
                </p>
                <p className="mt-1 text-xs text-ash">{level.blurb}</p>
              </div>
              <span className="rounded-lg border border-moss bg-granite/60 px-3 py-1.5 font-mono text-xs text-ash">
                {level.maxDays === null
                  ? `${level.minDays}+ days`
                  : `${level.minDays}–${level.maxDays} days`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading eyebrow="Questions" title="Things people ask" />
        <div className="mt-6 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="stone-panel group p-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5">
                <span className="font-display text-base font-semibold">{item.q}</span>
                <span
                  className="shrink-0 text-ash transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ash">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Panel className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Ready? Look up a wallet.
          </h2>
          <div className="mx-auto mt-6 max-w-xl">
            <WalletSearch size="md" />
          </div>
          <div className="mt-6">
            <ButtonLink href="/graveyard" variant="secondary" size="md">
              ENTER THE GRAVEYARD
            </ButtonLink>
          </div>
        </Panel>
      </section>
    </Container>
  );
}

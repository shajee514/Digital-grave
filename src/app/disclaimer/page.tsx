import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important information about $RIP and Digital Grave.',
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="September 2026">
      <h2>This is a meme project</h2>
      <p>
        Digital Grave is entertainment. It turns public blockchain activity into
        a joke about holding and selling. Nothing here is financial, investment,
        legal or tax advice.
      </p>

      <h2>No promises about value</h2>
      <p>
        We make <strong>no promise, prediction or guarantee</strong> about the
        price of $RIP or any token. Tokens can lose all of their value. Never
        risk money you cannot afford to lose entirely.
      </p>

      <h2>Graves and levels are cosmetic</h2>
      <p>
        Graves, survival levels, achievements and leaderboard positions are
        decorative. They carry <strong>no monetary value</strong>, no ownership,
        no revenue share and no entitlement of any kind. They are not securities
        and they are not rewards for investing.
      </p>

      <h2>Causes of death are jokes</h2>
      <p>
        The &quot;cause of death&quot; on a grave is generated from how long a
        position was held, using a fixed rule. It is not a factual claim about
        anyone&apos;s intentions, decisions, profit or loss.
      </p>

      <h2>Data accuracy</h2>
      <p>
        Wallet information is built from public blockchain records. Indexing can
        lag, miss events, or misclassify an unusual transaction. Always verify
        anything important against a block explorer. We do not guarantee that
        anything shown here is complete or correct.
      </p>

      <h2>Not affiliated</h2>
      <p>
        Digital Grave is an independent community project. It is not affiliated
        with, endorsed by, or sponsored by Robinhood Markets, Inc. or any
        exchange, wallet or blockchain foundation.
      </p>

      <h2>Security</h2>
      <p>
        We will <strong>never</strong> ask for your seed phrase, recovery words,
        private key or any password. Anyone who does is trying to steal from
        you, even if they claim to represent this project.
      </p>
    </LegalPage>
  );
}

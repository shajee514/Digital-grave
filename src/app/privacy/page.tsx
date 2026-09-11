import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Digital Grave collects, and what it does not.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="September 2026">
      <h2>The short version</h2>
      <p>
        We do not ask you to create an account, and we do not want your personal
        information. You can use the entire site without connecting a wallet.
      </p>

      <h2>What we never collect</h2>
      <ul>
        <li>• Seed phrases, recovery words or private keys — never, for any reason</li>
        <li>• Passwords of any kind</li>
        <li>• Names, email addresses or phone numbers</li>
        <li>• Your wallet address tied to an identity or an analytics profile</li>
      </ul>

      <h2>Public blockchain data</h2>
      <p>
        Wallet addresses, balances and transactions are already public on the
        blockchain. We read that public data and present it. We do not create it
        and we cannot delete it, because it does not belong to us — it lives on a
        public ledger that anyone can read.
      </p>

      <h2>Anonymous usage statistics</h2>
      <p>
        We count things like how many wallet searches happened and which pages
        were viewed, so we know what to improve. These counts are{' '}
        <strong>anonymous</strong>: wallet addresses are stripped out before
        anything is recorded, and events are never linked to a person.
      </p>

      <h2>Connecting a wallet</h2>
      <p>
        If you choose to connect a wallet, your browser shares only your public
        address with the page. Nothing is stored on our servers, no signature or
        transaction is requested, and disconnecting clears it immediately.
      </p>

      <h2>Rate limiting</h2>
      <p>
        To stop abuse of the public API, we temporarily count requests per
        network address in memory. These counters expire within minutes and are
        never written to disk or shared.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use for the Digital Grave website.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="September 2026">
      <h2>Using this site</h2>
      <p>
        Digital Grave is provided free of charge, as-is, for entertainment. By
        using it you accept these terms and the{' '}
        <strong>Disclaimer</strong>.
      </p>

      <h2>What you may do</h2>
      <ul>
        <li>• Look up any public wallet address</li>
        <li>• Share grave cards and links</li>
        <li>• Browse the graveyard, leaderboard and public profiles</li>
      </ul>

      <h2>What you may not do</h2>
      <ul>
        <li>• Attempt to fake, forge or alter grave records</li>
        <li>• Scrape or overload the site or its API</li>
        <li>• Use the site to harass, dox or target any individual</li>
        <li>• Present the site or its content as financial advice</li>
      </ul>

      <h2>Records cannot be faked</h2>
      <p>
        Every grave, life and statistic is derived from public blockchain data.
        Users cannot create or edit records, and administrators cannot rewrite
        historical transaction data through the admin interface. The chain is
        the source of truth.
      </p>

      <h2>Availability</h2>
      <p>
        The site may be offline, delayed or incomplete at any time. Features may
        change or be removed. No uptime or accuracy is guaranteed.
      </p>

      <h2>No liability</h2>
      <p>
        To the fullest extent permitted by law, the project and its contributors
        are not liable for any loss arising from use of this site, including
        financial loss from trading any token.
      </p>

      <h2>Cosmetic items only</h2>
      <p>
        Graves, levels, achievements and any future collectibles are cosmetic.
        They confer <strong>no financial value, ownership or entitlement</strong>{' '}
        and may be changed or reset at any time.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from 'next';
import { Container, Panel, SectionHeading } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { ConfigRequired } from '@/components/ui/ConfigRequired';
import { contracts, missingConfiguration } from '@/lib/config/contracts';
import { publicEnv } from '@/lib/config/env';
import { ALL_CAUSES } from '@/lib/domain/causes';
import { SURVIVAL_LEVELS } from '@/lib/domain/levels';
import { dataSource } from '@/lib/data';
import { getAllCelebrities } from '@/lib/celebrities/source';
import { CelebrityAvatar } from '@/components/celebrity/CelebrityAvatar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * ADMIN DASHBOARD — read-only status view for Phase 1.
 *
 * Editing is deliberately not wired up yet: real login protection needs
 * Supabase (Phase 2). Shipping an editable admin page with no working
 * authentication would be a security hole, so this page currently shows
 * configuration status only.
 *
 * Blockchain-derived records are never editable from here by design.
 */
export default async function AdminPage() {
  const missing = missingConfiguration();
  const celebrities = getAllCelebrities();

  const rows = [
    { label: 'Data mode', value: dataSource.mode.toUpperCase() },
    { label: 'Chain', value: `${publicEnv.chainName} (${publicEnv.chainId})` },
    { label: 'RPC URL', value: publicEnv.rpcUrl || null, env: 'NEXT_PUBLIC_RH_RPC_URL' },
    {
      label: 'Explorer',
      value: publicEnv.explorerUrl || null,
      env: 'NEXT_PUBLIC_RH_EXPLORER_URL',
    },
    {
      label: '$RIP token',
      value: contracts.token,
      env: 'NEXT_PUBLIC_RIP_TOKEN_ADDRESS',
    },
    {
      label: 'DEX pair(s)',
      value: contracts.pairs.length > 0 ? contracts.pairs.join(', ') : null,
      env: 'NEXT_PUBLIC_RIP_PAIR_ADDRESS',
    },
    {
      label: 'DEX router(s)',
      value: contracts.routers.length > 0 ? contracts.routers.join(', ') : null,
      env: 'NEXT_PUBLIC_RIP_ROUTER_ADDRESS',
    },
    {
      label: 'Supabase',
      value: publicEnv.supabaseUrl || null,
      env: 'NEXT_PUBLIC_SUPABASE_URL',
    },
    {
      label: 'Rewards',
      value: publicEnv.rewardsEnabled ? `Enabled (${publicEnv.rewardsMode})` : 'Disabled',
    },
  ];

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Internal"
        title="Admin"
        subtitle="Configuration status for the site. Blockchain transaction records are never editable from this dashboard — the chain is always the source of truth."
      />

      <Panel className="mt-8 border-legendary/30">
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden>
            🔒
          </span>
          <div>
            <h2 className="font-display text-base font-bold">
              Editing is locked until Phase 2
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ash">
              Changing settings from a web page requires a real login, and a real
              login requires the database. This page is read-only for now rather
              than pretending to work. Everything below is changed by editing the{' '}
              <code className="font-mono text-bone">.env.local</code> file.
            </p>
          </div>
        </div>
      </Panel>

      <section className="mt-8">
        <h2 className="label-caps">Configuration</h2>
        <div className="mt-4 space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="stone-panel flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <span className="text-sm font-semibold text-bone">{row.label}</span>
              {row.value ? (
                <code className="break-all font-mono text-xs text-alive">
                  {row.value}
                </code>
              ) : (
                <ConfigRequired what="Not set yet" envVar={row.env} />
              )}
            </div>
          ))}
        </div>
      </section>

      {missing.length > 0 ? (
        <Panel className="mt-8 border-legendary/30">
          <h2 className="font-display text-base font-bold text-legendary">
            Still to configure ({missing.length})
          </h2>
          <ul className="mt-3 space-y-1.5 font-mono text-xs text-ash">
            {missing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="label-caps">Causes of death ({ALL_CAUSES.length})</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALL_CAUSES.map((cause) => (
              <Badge key={cause} tone="dead">
                {cause}
              </Badge>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ash/70">
            Chosen by a fixed rule from how long the position was held, so the
            same grave always shows the same cause.
          </p>
        </Panel>

        <Panel>
          <h2 className="label-caps">Survival levels ({SURVIVAL_LEVELS.length})</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {SURVIVAL_LEVELS.map((level) => (
              <li key={level.level} className="flex justify-between gap-3">
                <span className={level.colorClass}>{level.level}</span>
                <span className="font-mono text-xs text-ash">
                  {level.maxDays === null
                    ? `${level.minDays}d+`
                    : `${level.minDays}–${level.maxDays}d`}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* ---------- Celebrity Graveyard ---------- */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="label-caps">
            Celebrity Graveyard ({celebrities.length} parody profiles)
          </h2>
          <Link
            href="/celebrities"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-ash transition-colors hover:text-bone"
          >
            View public page →
          </Link>
        </div>

        <Panel className="mt-4 border-legendary/30">
          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden>
              ✏️
            </span>
            <div>
              <h3 className="font-display text-base font-bold">
                Editing arrives with the database
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                Add, edit, delete and feature controls need a login and a place
                to save changes, which both come with Supabase in Phase 2. The
                profiles are already stored as plain data in{' '}
                <code className="font-mono text-bone">
                  src/lib/celebrities/data.ts
                </code>
                , using exactly the fields the admin form will use — so nothing
                here will need rebuilding when the database is connected.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ash/70">
                Every profile is locked to parody-only content. There is no
                field for a wallet address or a token balance anywhere in the
                celebrity data, so this section cannot claim that anyone holds
                or endorses $RIP.
              </p>
            </div>
          </div>
        </Panel>

        <div className="mt-4 space-y-2">
          {celebrities.map((celebrity) => (
            <div
              key={celebrity.id}
              className="stone-panel flex flex-wrap items-center gap-4 p-4"
            >
              <CelebrityAvatar
                avatar={celebrity.avatar}
                name={celebrity.name}
                showEmblem={false}
                className="h-10 w-10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-bone">
                  {celebrity.displayName}
                </p>
                <p className="mt-0.5 truncate font-mono text-xs text-ash">
                  /celebrities/{celebrity.slug}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{celebrity.category}</Badge>
                <Badge tone={celebrity.avatar.accent}>
                  {celebrity.graveStatus}
                </Badge>
                {celebrity.featured ? (
                  <Badge tone="legendary">Featured</Badge>
                ) : null}
                <Badge tone="legendary">Parody</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

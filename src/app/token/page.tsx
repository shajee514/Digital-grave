import type { Metadata } from 'next';
import { Container, Panel, SectionHeading } from '@/components/ui/Panel';
import { ConfigRequired } from '@/components/ui/ConfigRequired';
import { CopyButton } from '@/components/ui/CopyButton';
import { ButtonLink } from '@/components/ui/Button';
import { Gravestone } from '@/components/brand/Gravestone';
import { contracts } from '@/lib/config/contracts';
import { publicEnv } from '@/lib/config/env';
import { explorerLink } from '@/lib/config/chain';
import { site, socialLinks } from '@/lib/config/site';
import { isLiveMode } from '@/lib/config/mode';
import { getTokenInfo } from '@/lib/chain/token';
import { formatAmount } from '@/lib/domain/format';

export const metadata: Metadata = {
  title: 'Token',
  description: 'Official $RIP token information for Digital Grave on Robinhood Chain.',
};

/** Live token facts are read per request so supply stays current. */
export const dynamic = 'force-dynamic';

export default async function TokenPage() {
  const tokenExplorer = contracts.token ? explorerLink('token', contracts.token) : null;

  /**
   * Supply is read straight from the contract. If the chain cannot be
   * reached we show the configuration notice rather than a stale or
   * invented number.
   */
  let supply: { total: number; symbol: string } | null = null;
  if (isLiveMode && contracts.token) {
    try {
      const info = await getTokenInfo();
      supply = { total: info.totalSupply, symbol: info.symbol };
    } catch {
      supply = null;
    }
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Official information"
            title={<>{site.name}<br />{site.ticker}</>}
            subtitle={site.slogan}
          />

          <div className="mt-8">
            <span className="label-caps">Contract Address</span>
            {contracts.token ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <code className="break-all rounded-xl border border-moss bg-granite/60 px-4 py-3 font-mono text-sm text-bone">
                  {contracts.token}
                </code>
                <CopyButton value={contracts.token} label="COPY CONTRACT" />
              </div>
            ) : (
              <div className="mt-3">
                <ConfigRequired
                  what="The $RIP contract address will appear here the moment the token is deployed. No placeholder address is shown, because a fake address could cost you money."
                  envVar="NEXT_PUBLIC_RIP_TOKEN_ADDRESS"
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {tokenExplorer ? (
              <ButtonLink href={tokenExplorer} variant="secondary" size="md" external>
                OPEN EXPLORER ↗
              </ButtonLink>
            ) : null}
            {contracts.dexSwapUrl ? (
              <ButtonLink href={contracts.dexSwapUrl} size="md" external>
                BUY $RIP ↗
              </ButtonLink>
            ) : (
              <span className="inline-flex h-11 items-center rounded-xl border border-moss bg-granite/40 px-5 text-sm font-semibold text-ash">
                BUY $RIP — not live yet
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Gravestone className="h-64 w-64 sm:h-80 sm:w-80" accent="legendary" />
        </div>
      </div>

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        <Panel>
          <h2 className="label-caps">Chain</h2>
          <p className="mt-2 font-display text-xl font-bold">{publicEnv.chainName}</p>
          <p className="mt-1 font-mono text-sm text-ash">Chain ID {publicEnv.chainId}</p>
        </Panel>

        <Panel>
          <h2 className="label-caps">Symbol &amp; Decimals</h2>
          <p className="mt-2 font-display text-xl font-bold">
            ${contracts.tokenSymbol}
          </p>
          <p className="mt-1 font-mono text-sm text-ash">
            {contracts.tokenDecimals} decimals
          </p>
        </Panel>

        <Panel>
          <h2 className="label-caps">Total Supply</h2>
          {supply ? (
            <>
              <p className="mt-2 font-display text-xl font-bold">
                {formatAmount(supply.total)}{' '}
                <span className="text-base text-ash">${supply.symbol}</span>
              </p>
              <p className="mt-1 text-xs text-ash">
                Read live from the token contract.
              </p>
            </>
          ) : (
            <div className="mt-3">
              <ConfigRequired
                what="Supply is read directly from the token contract once its address is configured and the chain is reachable. We do not publish a number we cannot verify on chain."
                envVar="NEXT_PUBLIC_RIP_TOKEN_ADDRESS"
              />
            </div>
          )}
        </Panel>

        <Panel>
          <h2 className="label-caps">DEX</h2>
          {contracts.dexName ? (
            <p className="mt-2 font-display text-xl font-bold">{contracts.dexName}</p>
          ) : (
            <div className="mt-3">
              <ConfigRequired
                what="The trading venue and liquidity pair are added after launch."
                envVar="NEXT_PUBLIC_DEX_NAME / NEXT_PUBLIC_RIP_PAIR_ADDRESS"
              />
            </div>
          )}
        </Panel>

        <Panel>
          <h2 className="label-caps">Block Explorer</h2>
          {publicEnv.explorerUrl ? (
            <a
              href={publicEnv.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block break-all font-mono text-sm text-alive hover:underline"
            >
              {publicEnv.explorerUrl}
            </a>
          ) : (
            <div className="mt-3">
              <ConfigRequired
                what="The Robinhood Chain explorer URL is set through the environment."
                envVar="NEXT_PUBLIC_RH_EXPLORER_URL"
              />
            </div>
          )}
        </Panel>

        <Panel>
          <h2 className="label-caps">Official Links</h2>
          {socialLinks.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-alive hover:underline"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3">
              <ConfigRequired
                what="Only real, verified accounts are ever linked here. Nothing is listed until the official accounts exist."
                envVar="NEXT_PUBLIC_TWITTER_URL / TELEGRAM / DISCORD"
              />
            </div>
          )}
        </Panel>
      </section>

      <Panel className="mt-10 border-dead/25">
        <h2 className="font-display text-lg font-bold">Before you buy anything</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ash">
          <li>
            • Always verify the contract address against an official source. Fake
            tokens copy real names.
          </li>
          <li>
            • $RIP is a meme token. Nothing on this site is financial advice, and
            no price movement is promised or implied.
          </li>
          <li>
            • Graves, levels and achievements are cosmetic. They have no monetary
            value and grant no entitlement.
          </li>
          <li>
            • Never share your seed phrase or private key with anyone, including
            anyone claiming to be from this project.
          </li>
        </ul>
      </Panel>
    </Container>
  );
}

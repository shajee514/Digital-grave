import { Gravestone } from '@/components/brand/Gravestone';
import { WalletSearch } from '@/components/wallet/WalletSearch';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/lib/config/site';
import { publicEnv } from '@/lib/config/env';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 grid-fog" aria-hidden />
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-px w-full animate-drift bg-gradient-to-r from-transparent via-alive/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-8">
        <div className="flex flex-col items-start">
          <span className="animate-fade-in rounded-full border border-moss bg-granite/50 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ash">
            On {publicEnv.chainName} · Chain ID {publicEnv.chainId}
          </span>

          <h1 className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            DIGITAL
            <br />
            <span className="bg-gradient-to-br from-bone via-bone to-ash bg-clip-text text-transparent">
              GRAVE
            </span>
          </h1>

          <p className="mt-4 animate-fade-up font-mono text-2xl font-bold tracking-[0.1em] text-alive sm:text-3xl">
            {site.ticker}
          </p>

          <p className="mt-5 animate-fade-up font-display text-lg font-bold tracking-[0.06em] text-bone sm:text-xl">
            {site.slogan}
          </p>

          <p className="mt-4 max-w-md animate-fade-up text-sm leading-relaxed text-ash sm:text-base">
            {site.subtitle.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <div className="mt-8 w-full max-w-xl animate-fade-up">
            <WalletSearch size="lg" />
          </div>

          <div className="mt-6 flex w-full flex-wrap gap-3 animate-fade-up">
            <ButtonLink href="/search" variant="primary" size="lg">
              SEARCH A WALLET
            </ButtonLink>
            <ButtonLink href="/graveyard" variant="secondary" size="lg">
              ENTER THE GRAVEYARD
            </ButtonLink>
          </div>
        </div>

        {/* The mascot */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute h-64 w-64 rounded-full bg-reborn/10 blur-3xl sm:h-80 sm:w-80"
            aria-hidden
          />
          <Gravestone className="relative h-72 w-72 sm:h-96 sm:w-96" accent="reborn" />
        </div>
      </div>
    </section>
  );
}

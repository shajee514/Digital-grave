import Link from 'next/link';
import { LogoMark } from '@/components/brand/Logo';
import { footerLinks, site, socialLinks } from '@/lib/config/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-moss/60 bg-soil/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="font-display text-sm font-bold tracking-[0.14em]">
                {site.name}
              </span>
            </div>
            <p className="mt-3 font-mono text-xs tracking-[0.2em] text-alive">
              {site.ticker}
            </p>
            <p className="mt-3 font-display text-sm font-semibold tracking-wide text-ash">
              {site.slogan}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="label-caps">Explore</h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.slice(0, 3).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ash transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label-caps">Legal</h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.slice(3).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ash transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label-caps">Community</h3>
              {socialLinks.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {socialLinks.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ash transition-colors hover:text-bone"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                /* No fake links: nothing is shown until real accounts exist. */
                <p className="mt-4 text-xs leading-relaxed text-ash/70">
                  Official links will appear here once the accounts are live.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-moss/50 pt-6">
          <p className="text-xs leading-relaxed text-ash/70">
            {site.name} is a meme project. Survival levels, graves and
            achievements are cosmetic and carry no financial value, ownership
            or entitlement. Nothing on this site is financial advice. Always do
            your own research.
          </p>
          <p className="mt-4 text-xs text-ash/60">
            © {new Date().getUTCFullYear()} {site.name}. {site.altSlogan}
          </p>
        </div>
      </div>
    </footer>
  );
}

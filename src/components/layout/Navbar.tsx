'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { navLinks } from '@/lib/config/site';
import { cn } from '@/lib/utils';

/**
 * Tracks whether the page has been scrolled, without storing React state
 * inside an effect. The browser is the source of truth and React simply
 * subscribes to it.
 */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

function useScrolled(): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();

  /**
   * The mobile menu remembers WHICH page it was opened on. Navigating to a
   * different page therefore closes it automatically, with no extra code.
   */
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;

  // Stop the page scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-moss/70 bg-void/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors',
                isActive(link.href)
                  ? 'text-alive'
                  : 'text-ash hover:bg-granite/60 hover:text-bone',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ConnectWalletButton />
          </div>

          <button
            type="button"
            onClick={() => setOpenOnPath(open ? null : pathname)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-moss text-bone transition-colors hover:bg-granite xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-5">
              <span
                className={cn(
                  'absolute left-0 h-0.5 w-5 bg-current transition-all duration-300',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-200',
                  open && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-0.5 w-5 bg-current transition-all duration-300',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-moss/60 bg-void/95 backdrop-blur-xl transition-[max-height] duration-300 xl:hidden',
          open ? 'max-h-[32rem]' : 'max-h-0 border-t-0',
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpenOnPath(null)}
              className={cn(
                'rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors',
                isActive(link.href)
                  ? 'bg-alive/10 text-alive'
                  : 'text-ash hover:bg-granite/60 hover:text-bone',
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 sm:hidden">
            <ConnectWalletButton fullWidth />
          </div>
        </div>
      </div>
    </header>
  );
}

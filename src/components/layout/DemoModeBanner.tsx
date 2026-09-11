import { isDemoMode } from '@/lib/config/mode';
import { isTokenConfigured } from '@/lib/config/contracts';

/**
 * A permanent, honest notice while the site is running on sample data.
 * It disappears automatically once real data is switched on.
 */
export function DemoModeBanner() {
  if (!isDemoMode) return null;

  return (
    <div className="border-b border-legendary/25 bg-legendary/[0.07]">
      <p className="mx-auto max-w-6xl px-4 py-2 text-center text-[0.7rem] leading-relaxed text-legendary sm:px-6 sm:text-xs">
        <span className="font-bold">🧪 DEMO MODE</span> — every wallet, grave
        and number on this site is sample data used to preview the design.
        {isTokenConfigured
          ? ' Real $RIP data is not connected yet.'
          : ' The $RIP token address has not been configured yet.'}
      </p>
    </div>
  );
}

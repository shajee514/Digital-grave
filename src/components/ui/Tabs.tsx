import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface TabOption {
  key: string;
  label: string;
}

/**
 * Filter tabs implemented as real links, so filters are shareable,
 * bookmarkable and work without JavaScript.
 *
 * This is a server component on purpose. It has no interactivity of its
 * own, which lets the pages pass it a plain `buildHref` function.
 */
export function LinkTabs({
  options,
  active,
  buildHref,
  className,
}: {
  options: readonly TabOption[];
  active: string;
  buildHref: (key: string) => string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0',
        className,
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = option.key === active;
        return (
          <Link
            key={option.key}
            href={buildHref(option.key)}
            role="tab"
            aria-selected={isActive}
            scroll={false}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all',
              isActive
                ? 'border-alive/50 bg-alive/10 text-alive'
                : 'border-moss bg-granite/40 text-ash hover:border-ash/50 hover:text-bone',
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

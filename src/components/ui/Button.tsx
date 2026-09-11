import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'reborn';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-alive text-void font-bold hover:bg-alive/90 shadow-glow-alive hover:shadow-[0_0_32px_-4px_rgba(34,224,122,0.6)]',
  secondary:
    'border border-moss bg-granite/60 text-bone hover:border-ash/60 hover:bg-granite',
  ghost: 'text-ash hover:text-bone hover:bg-granite/60',
  danger:
    'bg-dead text-void font-bold hover:bg-dead/90 shadow-glow-dead',
  reborn:
    'bg-reborn text-void font-bold hover:bg-reborn/90 shadow-glow-reborn',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 whitespace-nowrap';

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external = false,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(variant, size, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

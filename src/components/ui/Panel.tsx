import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Panel({
  className,
  children,
  hover = false,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div className={cn('stone-panel p-5 sm:p-6', hover && 'stone-panel-hover', className)}>
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  valueClass,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  valueClass?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="label-caps">{label}</span>
      <span className={cn('font-display text-2xl font-bold leading-none tracking-tight sm:text-3xl', valueClass)}>
        {value}
      </span>
      {sub ? <span className="text-xs text-ash">{sub}</span> : null}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {eyebrow ? <div className="label-caps text-alive">{eyebrow}</div> : null}
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-ash sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function Container({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  /** Optional anchor target, so sections can be linked to directly. */
  id?: string;
}) {
  return (
    <div id={id} className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}>
      {children}
    </div>
  );
}

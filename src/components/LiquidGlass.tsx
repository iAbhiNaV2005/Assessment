import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'card' | 'panel' | 'pill' | 'highlight';
  interactive?: boolean;
  className?: string;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  variant = 'card',
  interactive = false,
  className,
  ...props
}) => {
  const baseClasses = variant === 'pill'
    ? 'liquid-glass-pill px-4 py-2'
    : 'liquid-glass rounded-2xl p-6';

  const interactiveClass = interactive ? 'liquid-glass-interactive cursor-pointer' : '';

  return (
    <div
      className={twMerge(
        clsx(
          baseClasses,
          interactiveClass,
          variant === 'highlight' && 'border-plum-400/40 dark:border-plum-400/30',
          className
        )
      )}
      {...props}
    >
      {/* Subtle top edge refraction highlight */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/20 to-transparent" 
      />
      {children}
    </div>
  );
};

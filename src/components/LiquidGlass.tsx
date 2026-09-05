'use client';

/**
 * LiquidGlass Component
 * Implements Apple's Liquid Glass physical refraction effect for React.
 * Uses liquid-glass-react with custom physical bevel edges and theme adaptation.
 * Free of emojis.
 */

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with SSR fallback to prevent any canvas displacement SSR conflicts
const LiquidGlassCore = dynamic(() => import('liquid-glass-react'), {
  ssr: false,
  loading: () => null,
});

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'card' | 'panel' | 'pill' | 'highlight';
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  cornerRadius?: number;
  displacementScale?: number;
  blurAmount?: number;
  className?: string;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  variant = 'card',
  intensity = 'medium',
  interactive = false,
  cornerRadius,
  displacementScale,
  blurAmount,
  className = '',
  style,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultScale =
    displacementScale ?? (intensity === 'low' ? 20 : intensity === 'high' ? 60 : 40);
  const defaultBlur =
    blurAmount ?? (intensity === 'low' ? 0.04 : intensity === 'high' ? 0.12 : 0.08);

  const radius = cornerRadius ?? (variant === 'pill' ? 9999 : 24);

  // Variant classes using semantic theme tokens
  const getVariantStyles = () => {
    switch (variant) {
      case 'pill':
        return 'rounded-full px-4 py-1.5 shadow-glass-sm border border-rule-light/80 dark:border-rule-dark/80 bg-white/75 dark:bg-surface-dark/75';
      case 'panel':
        return 'rounded-2xl p-4 sm:p-6 shadow-glass border border-rule-light/90 dark:border-rule-dark/80 bg-white/80 dark:bg-surface-dark/80';
      case 'highlight':
        return 'rounded-2xl p-6 sm:p-8 shadow-glass-lg border border-plum-500/30 dark:border-plum-400/30 bg-gradient-to-br from-plum-50/70 via-white/80 to-white/60 dark:from-plum-950/40 dark:via-surface-dark/85 dark:to-surface-dark/60';
      case 'card':
      default:
        return 'rounded-2xl p-6 sm:p-8 shadow-glass border border-rule-light/90 dark:border-rule-dark/80 bg-white/80 dark:bg-surface-dark/80';
    }
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glass-lg active:scale-[0.99] cursor-pointer'
    : '';

  return (
    <div
      className={`relative overflow-hidden backdrop-blur-xl ${getVariantStyles()} ${interactiveStyles} ${className}`}
      style={{
        borderRadius: `${radius}px`,
        ...style,
      }}
      {...props}
    >
      {/* Underlying liquid-glass-react displacement effect when mounted */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25 overflow-hidden">
          <LiquidGlassCore
            cornerRadius={radius}
            displacementScale={defaultScale}
            blurAmount={defaultBlur}
            aberrationIntensity={1.5}
            elasticity={0.2}
            style={{ width: '100%', height: '100%' }}
          >
            <div className="w-full h-full" />
          </LiquidGlassCore>
        </div>
      )}

      {/* Top specular edge reflection highlight (Apple Liquid Glass edge) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 dark:via-white/25 to-transparent"
      />

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { env } from '@/env';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseAdProps = {
  slot: string;
  className?: string;
  minHeight?: number;
};

export const AdSenseAd = ({ slot, className, minHeight = 140 }: AdSenseAdProps) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const style = useMemo(() => ({ display: 'block', minHeight, width: '100%' }), [minHeight]);

  useEffect(() => {
    if (!slot) return;
    if (typeof window === 'undefined') return;
    if (!insRef.current) return;

    const alreadyInitialized = insRef.current.getAttribute('data-adsbygoogle-status');
    if (alreadyInitialized) return;

    const push = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        return;
      }
    };

    let timeoutId: number | undefined;
    const rafId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(push, 50);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [slot]);

  return (
    <ins
      ref={insRef}
      className={['adsbygoogle', className].filter(Boolean).join(' ')}
      style={style}
      data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSenseAd;

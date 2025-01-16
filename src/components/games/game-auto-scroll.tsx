'use client';

import { useEffect } from 'react';

export default function GameAutoScroll() {
  useEffect(() => {
    // 等待一小段时间确保页面完全加载
    const timer = setTimeout(() => {
      document.getElementById('game-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
} 
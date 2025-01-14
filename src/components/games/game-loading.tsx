'use client';

import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { Trans, Plural } from '@lingui/macro';

export type LoadingState = 'initial' | 'loading' | 'retrying' | 'success' | 'error';

// 预定义常量，避免重复创建
const SPINNER_EMOJIS = [
  { emoji: '🎲', delay: '0s', distance: 38 },
  { emoji: '🎯', delay: '0.5s', distance: 38 },
  { emoji: '🎪', delay: '1s', distance: 38 },
  { emoji: '🎨', delay: '1.5s', distance: 38 }
] as const;

// 加载提示文本
const LOADING_TIPS = [
  <Trans key="loading-tip-1">正在召唤游戏精灵...</Trans>,
  <Trans key="loading-tip-2">组装游戏积木中...</Trans>,
  <Trans key="loading-tip-3">为您准备欢乐时光...</Trans>,
  <Trans key="loading-tip-4">打开快乐开关...</Trans>,
  <Trans key="loading-tip-5">注入游戏能量...</Trans>,
  <Trans key="loading-tip-6">调试游戏画面...</Trans>,
] as const;

// 抽取可重用的样式对象
const CONIC_GRADIENT_STYLES = {
  primary: {
    background: 'conic-gradient(from 0deg, rgba(56,189,248,0.15), rgba(99,102,241,0.15), rgba(56,189,248,0.15))',
    filter: 'blur(1px)',
  },
  secondary: {
    background: 'conic-gradient(from 180deg, rgba(56,189,248,0.1), rgba(99,102,241,0.1), rgba(56,189,248,0.1))',
    filter: 'blur(1px)',
    transform: 'scale(1.1)',
  }
} as const;

// 游戏风格的加载动画组件
const GameLoadingSpinner = memo(() => {
  // 使用useMemo缓存装饰性元素的样式计算
  const decorativeElements = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      key: i,
      transform: `rotate(${i * 45}deg) translateY(-45px)`,
      animationDelay: `${i * 0.2}s`
    })), []
  );

  // 使用useMemo缓存光点效果的样式计算
  const lightDots = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      key: i,
      transform: `rotate(${i * 45}deg) translateY(-40px)`,
      animationDelay: `${i * 0.2}s`
    })), []
  );

  return (
    <div className="relative w-32 h-32">
      {/* 外圈旋转光环 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[spin_3s_linear_infinite] opacity-20" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-[spin_2s_linear_infinite_reverse] opacity-20" />
      {/* 中心内容区域 */}
      <div className="absolute inset-4 flex items-center justify-center">
        <div className="relative w-24 h-24">
          {/* 旋转光环 */}
          <div className="absolute inset-0 rounded-full animate-spin-slow" style={CONIC_GRADIENT_STYLES.primary} />
          <div className="absolute inset-0 rounded-full animate-spin-reverse-slow" style={CONIC_GRADIENT_STYLES.secondary} />

          {/* 内容容器 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 主Emoji */}
            <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-pulse-smooth z-10 backdrop-blur-[2px]"
              style={{ animationDuration: '2s' }}>
              🎮
            </div>

            {/* 环绕的小Emoji */}
            <div className="absolute inset-0 animate-spin-smooth" style={{ animationDuration: '8s' }}>
              {SPINNER_EMOJIS.map((item, i) => (
                <div
                  key={i}
                  className="absolute text-lg transform -translate-x-1/2 -translate-y-1/2 animate-bounce-subtle backdrop-blur-[1px]"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 90}deg) translateY(-${item.distance}px) rotate(-${i * 90}deg)`,
                    animationDelay: item.delay,
                    filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.3))'
                  }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>

            {/* 光点效果 */}
            <div className="absolute inset-0">
              {lightDots.map(({ key, transform, animationDelay }) => (
                <div
                  key={key}
                  className="absolute w-1 h-1 rounded-full bg-sky-400/40"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform,
                    animation: 'pulse-dots 3s ease-in-out infinite',
                    animationDelay,
                    filter: 'drop-shadow(0 0 2px rgba(56,189,248,0.5))'
                  }}
                />
              ))}
            </div>
          </div>

          {/* 外部光效 */}
          <div className="absolute inset-[-50%] pointer-events-none">
            {/* 辐射光环 */}
            <div className="absolute inset-0 rounded-full animate-pulse-smooth"
              style={{ 
                background: 'radial-gradient(circle at center, rgba(56,189,248,0.15) 0%, transparent 70%)',
                animationDuration: '4s'
              }} />
            {/* 旋转光线 - 米字型 */}
            <div className="absolute inset-0 animate-spin-smooth" style={{ animationDuration: '8s' }}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-full h-[1px] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${i * 45}deg)`,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.15) 50%, transparent 100%)',
                    filter: 'blur(0.5px)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 装饰性元素 */}
      <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
        {decorativeElements.map(({ key, transform, animationDelay }) => (
          <div
            key={key}
            className="absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '48%',
              top: '48%',
              transform,
            }}
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse bg-gradient-to-r from-blue-400 to-purple-400"
              style={{ animationDelay }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

GameLoadingSpinner.displayName = 'GameLoadingSpinner';

// 动态加载提示组件
const LoadingTips = memo(() => {
  const [tipIndex, setTipIndex] = useState(0);
  const currentTip = useMemo(() => LOADING_TIPS[tipIndex], [tipIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 text-center">
      <p className="text-gray-500 animate-fade-in" key={tipIndex}>
        {currentTip}
      </p>
    </div>
  );
});

LoadingTips.displayName = 'LoadingTips';

// 重试指示器组件
const RetryIndicator = memo(({ count }: { count: number }) => (
  <div className="flex items-center justify-center gap-3 mt-4">
    {[...Array(3)].map((_, i) => (
      <div 
        key={i}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i < count ? 'bg-orange-500 scale-100' : 'bg-gray-300 scale-75'
        } ${i === count - 1 ? 'animate-ping' : ''}`}
      />
    ))}
  </div>
));

RetryIndicator.displayName = 'RetryIndicator';

interface GameLoadingProps {
  state: LoadingState;
  retryCount: number;
  onRetry?: () => void;
}

// Loading 状态展示组件
export const GameLoading = memo(({ state, retryCount, onRetry }: GameLoadingProps) => {
  const statusText = useMemo(() => {
    if (state === 'success') return null;
    if (state === 'initial') return <Trans>准备开始游戏</Trans>;
    if (state === 'loading') return <Trans>游戏加载中</Trans>;
    if (state === 'retrying') return <Trans>重新连接中</Trans>;
    if (state === 'error') return <Trans>连接失败</Trans>;
    return '';
  }, [state]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  }, [onRetry]);

  if (state === 'success') return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm z-10">
      <div className="max-w-md w-full mx-4 bg-white/90 rounded-3xl shadow-2xl p-8 transform transition-all">
        <div className="flex flex-col items-center">
          <GameLoadingSpinner />
          <div className="mt-8 w-full space-y-4">
            {(state === 'initial' || state === 'loading') && (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {statusText}
                </h3>
                <LoadingTips />
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`loading-dot-${i}`}
                      className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {state === 'retrying' && (
              <>
                <h3 className="text-xl font-bold text-orange-500 text-center">
                  {statusText}
                </h3>
                <p className="text-gray-500 text-center">
                  <Plural
                    value={retryCount}
                    one="第 # 次重试"
                    other="第 # 次重试"
                  />
                </p>
                <RetryIndicator count={retryCount} />
              </>
            )}
            {state === 'error' && (
              <>
                <h3 className="text-xl font-bold text-red-500 text-center">
                  {statusText}
                </h3>
                <p className="text-gray-500 text-center">
                  <Trans>请检查网络连接后重试</Trans>
                </p>
                <button
                  onClick={handleRetry}
                  className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Trans>重新加载</Trans>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

GameLoading.displayName = 'GameLoading'; 
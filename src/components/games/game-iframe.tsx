'use client';

import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GameLoading, LoadingState } from "./game-loading";

interface GameIframeProps {
  src: string;
}

export const GameIframe = memo(({ src }: GameIframeProps) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('initial');
  const [retryCount, setRetryCount] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number>(750);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timersRef = useRef<{
    loading?: NodeJS.Timeout;
    retry?: NodeJS.Timeout;
  }>({});

  // 处理来自iframe的高度变化消息
  useEffect(() => {
    const handleHeightChange = (event: MessageEvent) => {
      if (typeof event.data === 'object' && 
          event.data.type === 'heightChange' && 
          typeof event.data.height === 'number') {
        const newHeight = Math.max(750, Math.ceil(event.data.height) + 100);
        // console.log('newHeight===》》》》', newHeight);
        setContainerHeight(newHeight);
      }
    };

    window.addEventListener('message', handleHeightChange);
    return () => window.removeEventListener('message', handleHeightChange);
  }, []);

  // 使用useMemo缓存URL对象
  const urlWithTimestamp = useMemo(() => {
    const url = new URL(src);
    url.searchParams.set('t', Date.now().toString());
    return url.toString();
  }, [src]);

  const resetIframe = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
      requestAnimationFrame(() => {
        if (iframeRef.current) {
          iframeRef.current.src = urlWithTimestamp;
        }
      });
    }
  }, [urlWithTimestamp]);

  const clearTimers = useCallback(() => {
    Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));
    timersRef.current = {};
  }, []);

  const handleIframeError = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setLoadingState('retrying');
      resetIframe();
    } else {
      setLoadingState('error');
    }
  }, [retryCount, resetIframe]);

  const handleIframeLoad = useCallback(() => {
    clearTimers();

    if (iframeRef.current) {
      requestAnimationFrame(() => {
        try {
          const iframeWindow = iframeRef.current?.contentWindow;
          if (iframeWindow && iframeWindow.location.href !== 'about:blank') {
            setLoadingState('success');
          } else {
            handleIframeError();
          }
        } catch (error) {
          setLoadingState('success');
        }
      });
    }
  }, [handleIframeError, clearTimers]);

  useEffect(() => {
    setLoadingState('loading');
    setRetryCount(0);
    resetIframe();

    timersRef.current.loading = setTimeout(() => {
      if (loadingState === 'loading') {
        handleIframeError();
      }
    }, 15000);

    return clearTimers;
  }, [src, handleIframeError, resetIframe, clearTimers]);

  const iframeClassName = useMemo(() => 
    `w-full h-full border-none transition-all duration-300 ${
      loadingState === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`,
    [loadingState]
  );

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setLoadingState('loading');
    resetIframe();
  }, [resetIframe]);

  return (
    <div 
      className="game-iframe-container relative w-full rounded-lg shadow-lg bg-gradient-to-r from-purple-50/50 to-white/50"
      style={{ 
        height: `${containerHeight}px`,
        transition: 'height 0.3s ease-in-out'
      }}
    >
      <GameLoading state={loadingState} retryCount={retryCount} onRetry={handleRetry} />
      <iframe
        ref={iframeRef}
        className={iframeClassName}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        loading="eager"
        allow="fullscreen"
        title="Game Iframe"
        style={{ 
          height: '100%',
          border: 'none'
        }}
      />
    </div>
  );
});

GameIframe.displayName = 'GameIframe';

export default GameIframe;                                                                          
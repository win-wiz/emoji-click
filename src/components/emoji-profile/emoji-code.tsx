'use client';

import { useState, useCallback, memo } from "react";
import EmojiShadow from "./emoji-shadown";
import { ClipboardCopy } from "lucide-react";
import { Trans } from "@lingui/macro";

// 提取 Toast 组件
const Toast = memo(function Toast() {
  return (
    <div className="fixed top-6 left-1/2 z-50">
      <div id="toast-success" className="hidden h-8">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 animate-toast-in">
          <span className="text-success">✓</span>
          <span className="text-sm text-success">
            <Trans>复制成功</Trans>
          </span>
        </div>
      </div>

      <div id="toast-error" className="hidden h-8">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-error/10 animate-toast-in">
          <span className="text-error">!</span>
          <span className="text-sm text-error">
            <Trans>复制失败</Trans>
          </span>
        </div>
      </div>
    </div>
  );
});

// 提取 CopyButton 组件
const CopyButton = memo(function CopyButton({ 
  copied, 
  onCopy 
}: { 
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={copied}
      tabIndex={0}
      className={`
        group relative px-8 py-3 rounded-full text-sm font-medium h-[46px]
        ${copied 
          ? 'bg-success/10 text-success border border-success/20' 
          : 'bg-white backdrop-blur-sm border border-primary/20 text-primary hover:border-primary/30 hover:bg-primary/5'
        }
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
        active:scale-95 hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-white disabled:hover:border-primary/20
        disabled:hover:scale-100
      `}
    >
      <div className="relative z-10 flex items-center gap-2.5 h-full justify-center">
        {copied ? (
          <>
            <span className="text-base animate-bounce-mini">✓</span>
            <Trans>复制成功</Trans>
          </>
        ) : (
          <>
            <ClipboardCopy className="w-4 h-4" strokeWidth={2} />
            <Trans>复制表情</Trans>
          </>
        )}
      </div>
      {!copied && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
});

// 提取 EmojiDisplay 组件
const EmojiDisplay = memo(function EmojiDisplay({ 
  code, 
  onCopy 
}: { 
  code: string;
  onCopy: () => void;
}) {
  return (
    <div className="relative group mb-12">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative">
        <div 
          onClick={onCopy}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCopy();
            }
          }}
          className="relative z-10 text-[140px] sm:text-[180px] leading-none cursor-pointer select-none transform-gpu transition-all duration-500 hover:scale-110 active:scale-95"
        >
          {code}
        </div>
      </div>
    </div>
  );
});

export default function EmojiCode({ 
  code,
  name
}: { 
  code: string;
  name: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        (toastElement as HTMLDivElement).classList.remove('hidden');
        setTimeout(() => {
          (toastElement as HTMLDivElement).classList.add('hidden');
        }, 2000);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const toastElement = document.getElementById('toast-error');
      if (toastElement) {
        (toastElement as HTMLDivElement).classList.remove('hidden');
        setTimeout(() => {
          (toastElement as HTMLDivElement).classList.add('hidden');
        }, 2000);
      }
    }
  }, [code]);

  return (
    <>
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-primary/5 to-transparent" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
          </div>
        </div>

        {/* 主要内容 */}
        <div className="relative w-full max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <EmojiDisplay code={code} onCopy={handleCopy} />

            {/* 标题区域 */}
            <div className="relative mb-16 text-center max-w-3xl">
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {name}
              </h1>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <CopyButton copied={copied} onCopy={handleCopy} />
            </div>
          </div>
        </div>

        <EmojiShadow />
      </div>

      <Toast />
    </>
  );
}

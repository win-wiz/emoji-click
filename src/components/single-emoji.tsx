"use client";

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
// import { EmojiItem } from "@/types/emoji";
import { Trans } from "@lingui/macro";
import { ClipboardCopy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function SingleEmoji({ 
  emojiItem,
  lang,
}: { 
  emojiItem: Record<string, any>,
  lang: AVAILABLE_LOCALES,
}) {

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async (emoji: string, index: number) => {

    try {
      await navigator.clipboard.writeText(emoji)
      setCopySuccess(true)
      setTimeout(() => {
        setCopySuccess(false)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  return (
    <section
      className="group relative flex flex-col items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
    >
      {/* 主要内容区域 - 点击跳转到详情页 */}
      <Link
        href={lang === DEFAULT_LOCALE ? `/details` : `/${lang}/details`}
        className="flex flex-col items-center flex-1 w-full cursor-pointer"
      >
        <span className="text-4xl sm:text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
          {emojiItem.emoji}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
          {emojiItem.description}
        </span>
      </Link>

      {/* 复制按钮 */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => handleCopy(emojiItem.emoji, emojiItem.id)}
          className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-300"
        >
          <ClipboardCopy 
            className="w-4 h-4 text-gray-400 hover:text-gray-600"
            onClick={() => handleCopy(emojiItem.emoji, emojiItem.id)}
          />
        </button>
        
      </div>

      {/* 复制成功提示 */}
      { 
        copySuccess && (
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
            <div className="relative flex items-center scale-90 sm:scale-100">
              <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full animate-pulse-slow" />
              <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200/50 rounded-full shadow-lg animate-scale-up backdrop-blur-sm">
                <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-green-500 flex items-center justify-center animate-check-mark">
                  <svg 
                    className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  <Trans>已复制</Trans>
                </span>
              </div>
            </div>
          </div>
      )}
    </section>
  )
}
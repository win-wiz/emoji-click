"use client";

import { AVAILABLE_LOCALES } from "@/locales/config";
import { Trans } from "@lingui/macro";
import { Info } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";

// 复制成功指示器
const CopySuccessIndicator = memo(function CopySuccessIndicator() {
  return (
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
          <p className="text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            <Trans>已复制</Trans>
          </p>
        </div>
      </div>
    </div>
  )
})

const SingleEmoji = memo(function SingleEmoji({ 
  emojiItem,
  lang,
}: { 
  emojiItem: Record<string, any>,
  lang: AVAILABLE_LOCALES,
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji)
      setCopySuccess(true)
      setTimeout(() => {
        setCopySuccess(false)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const detailsUrl = useMemo(() => `/${lang}/${emojiItem.fullCode}`, [lang, emojiItem.fullCode])

  return (
    <section className="group h-full relative flex flex-col items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300 w-full">
      <div
        onClick={() => handleCopy(emojiItem.code)}
        className="flex flex-col items-center flex-1 w-full cursor-pointer"
      >
        <span className="text-4xl sm:text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
          {emojiItem.code}
        </span>
        <span className="text-xs text-center sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
          {emojiItem.name}
        </span>
      </div>

      <Link href={detailsUrl}>
        <div className="absolute top-2 right-2">
          <button className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-300">
            <Info className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </Link>

      {copySuccess && <CopySuccessIndicator />}
    </section>
  )
})

export default SingleEmoji
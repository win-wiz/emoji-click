'use client'

import { memo } from "react"
import EmojiSectionTitle from "./emoji-section-title"
import { Trans } from "@lingui/macro"

// 抽离颜色配置，避免重复计算
const COLOR_SCHEMES = {
  0: {
    bg: 'bg-rose-50/30',
    title: 'text-rose-600',
    tag: 'bg-rose-100/50 text-rose-900 hover:bg-rose-100'
  },
  1: {
    bg: 'bg-sky-50/30',
    title: 'text-sky-600',
    tag: 'bg-sky-100/50 text-sky-900 hover:bg-sky-100'
  },
  2: {
    bg: 'bg-emerald-50/30',
    title: 'text-emerald-600',
    tag: 'bg-emerald-100/50 text-emerald-900 hover:bg-emerald-100'
  },
  3: {
    bg: 'bg-violet-50/30',
    title: 'text-violet-600',
    tag: 'bg-violet-100/50 text-violet-900 hover:bg-violet-100'
  },
  4: {
    bg: 'bg-amber-50/30',
    title: 'text-amber-600',
    tag: 'bg-amber-100/50 text-amber-900 hover:bg-amber-100'
  }
} as const

// 抽离公共样式
const TAG_BASE_CLASSES = "px-3.5 py-1.5 text-sm whitespace-nowrap rounded-full backdrop-blur-sm transition-colors duration-200 cursor-default"

// 抽离关键词标签组件
const KeywordTag = memo(function KeywordTag({
  content,
  colorIndex,
}: {
  content: string;
  colorIndex: keyof typeof COLOR_SCHEMES;
}) {
  return (
    <h4 className={`${TAG_BASE_CLASSES} ${COLOR_SCHEMES[colorIndex].tag}`}>
      {content}
    </h4>
  )
})

const EmojiKeywords = memo(function EmojiKeywords({
  keywords,
  searchTips,
}: {
  keywords: Array<{
    baseCode: string;
    tags: Array<{
      tag: string;
      contents: string[];
    }>;
  }>;
  searchTips: string;
}) {
  return (
    <section className="relative mb-16 text-center">
      <EmojiSectionTitle>
        <Trans>关键词</Trans>
      </EmojiSectionTitle>

      <div className="relative mt-8 max-w-3xl mx-auto">
        {keywords?.map((keyword) => (
          <div key={keyword.baseCode}>
            <div className="space-y-6">
              {keyword.tags.map((tagItem, index) => (
                <div 
                  key={`tag-${index}`}
                  className={`p-5 rounded-xl ${COLOR_SCHEMES[index as keyof typeof COLOR_SCHEMES].bg}`}
                >
                  {/* 标签标题 */}
                  <div className="mb-3">
                    <h3 className={`text-sm font-medium ${COLOR_SCHEMES[index as keyof typeof COLOR_SCHEMES].title}`}>
                      {tagItem.tag}
                    </h3>
                  </div>

                  {/* 关键词列表 */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tagItem.contents.map((content, idx) => (
                      <KeywordTag
                        key={`content-${idx}`}
                        content={content}
                        colorIndex={index as keyof typeof COLOR_SCHEMES}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 搜索小贴士 */}
      {searchTips && (
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="flex items-start gap-2 bg-blue-50/30 rounded-xl px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-600">
            <svg 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm text-blue-900/70">
              {searchTips}
            </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
})

EmojiKeywords.displayName = 'EmojiKeywords'

export default EmojiKeywords
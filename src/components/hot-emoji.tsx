'use client'

import { Trans } from '@lingui/macro'
import { useState } from 'react'

interface EmojiItem {
  emoji: string
  description: string
}

const hotEmojis: EmojiItem[] = [
  {
    emoji: '😊',
    description: '开心愉快'
  },
  {
    emoji: '🤣',
    description: '笑出眼泪'
  },
  {
    emoji: '🥰',
    description: '喜欢爱心'
  },
  {
    emoji: '😅',
    description: '尴尬而不失礼貌'
  },
  {
    emoji: '🎉',
    description: '庆祝祝贺'
  },
  {
    emoji: '😭',
    description: '伤心难过'
  },
  {
    emoji: '🤔',
    description: '思考疑惑'
  },
  {
    emoji: '😴',
    description: '困了想睡'
  },
  {
    emoji: '🥳',
    description: '开心庆祝'
  },
  {
    emoji: '😤',
    description: '生气愤怒'
  },
  {
    emoji: '🤗',
    description: '温暖拥抱'
  },
  {
    emoji: '😇',
    description: '天使乖巧'
  },
  {
    emoji: '🙄',
    description: '无语翻白眼'
  },
  {
    emoji: '😋',
    description: '美味可口'
  },
  {
    emoji: '🤩',
    description: '星星眼'
  }
]

export const HotEmoji = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (emoji: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(emoji)
      setCopiedIndex(index)
      setTimeout(() => {
        setCopiedIndex(null)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative -mx-6 sm:-mx-12 md:-mx-24 lg:-mx-32">
      <div className="absolute inset-0 bg-gray-50" />

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <span className="text-3xl sm:text-4xl">✨</span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            <Trans>热门表情</Trans>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {hotEmojis.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
            >
              <button
                onClick={() => {
                  // TODO: 添加跳转逻辑
                  // router.push(`/emoji/${item.emoji}`)
                }}
                className="flex flex-col items-center flex-1 w-full cursor-pointer"
              >
                <span className="text-4xl sm:text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  <Trans>{item.description}</Trans>
                </span>
              </button>

              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => handleCopy(item.emoji, index, e)}
                  className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-300"
                  title={`复制 ${item.description}`}
                >
                  <svg 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                    />
                  </svg>
                </button>
              </div>

              {copiedIndex === index && (
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
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
          <span>👆</span>
          <span><Trans>点击可以复制表情</Trans></span>
        </div>
      </div>
    </div>
  )
}

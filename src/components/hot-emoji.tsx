'use client'

import { Trans } from '@lingui/macro'
import SingleEmoji from './single-emoji'
import { AVAILABLE_LOCALES } from '@/locales/config'



export const HotEmoji = ({ 
  lang,
  hotEmojis = []
}: { 
  lang: AVAILABLE_LOCALES,
  hotEmojis: Record<string, any>[]
}) => {

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
            <SingleEmoji
              key={`hot-emojis-${index}`}
              emojiItem={item}
              lang={lang}
            />
          ))}
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
          <span>👆</span>
          <Trans>点击可以复制表情</Trans>
        </div>
      </div>
    </div>
  )
}

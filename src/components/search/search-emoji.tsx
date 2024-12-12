'use client'

import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/locales/config'
import SearchEmojiDropdown from './search-emoji-dropdown';
import SearchTypeWrite from './search-type-write';
import EmojiFuncTag from './emoji-func-tag';
import EmojiSearchExample from './emoji-search-example';

export const SearchEmoji = ({
  lang = DEFAULT_LOCALE
}: {
  lang?: AVAILABLE_LOCALES
}) => {

  const [searchText, setSearchText] = useState('')

  return (
    <div className="relative -mx-6 sm:-mx-12 md:-mx-24 lg:-mx-32">
      {/* 顶部渐变装饰 */}
      <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-purple-50/90" />
      
      {/* 主背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/90 via-purple-50/90 to-transparent backdrop-blur-sm" />
      
      <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
        {/* 标题和描述 */}
        <h1 className="text-3xl font-bold mb-3 text-gray-800 inline-block bg-clip-text">
          <Trans>用AI找到最适合的表情</Trans>
        </h1>

        <SearchTypeWrite />

        {/* 搜索框 - 点击时打开对话框 */}
        <SearchEmojiDropdown initText={searchText} lang={lang} />

        {/* 示例搜索 */}
        <EmojiSearchExample setSearchText={setSearchText} />

        {/* 功能标签 */}
        <EmojiFuncTag />
      </div>
    </div>
  )
}
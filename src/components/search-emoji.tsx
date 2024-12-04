'use client'

import { useState } from 'react'
import { Trans, t } from '@lingui/macro'
import SearchDialog from '@/components/search/search-dialog'

export const SearchEmoji = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const exampleSearches = [
    t`今天心情特别好`,
    t`想表达谢谢但点赞室`,
    t`不想上班好累啊`,
    t`老板等我了开开心`,
    t`朋友生日想祝福`,
    t`工作完成啦好棒`,
    t`困得不行了`
  ]

  return (
    <div className="relative -mx-6 sm:-mx-12 md:-mx-24 lg:-mx-32">
      {/* 顶部渐变装饰 */}
      <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-purple-50/90" />
      
      {/* 主背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/90 via-purple-50/90 to-transparent backdrop-blur-sm" />
      
      <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
        {/* 标题和描述 */}
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-purple-500 inline-block text-transparent bg-clip-text">
          <Trans>用AI找到最适合的表情</Trans>
        </h1>
        <p className="text-gray-600 mb-12">
          <Trans>用最自然的方式描述，AI 懂你想表达的每一种情绪</Trans>
        </p>

        {/* 搜索框 - 点击时打开对话框 */}
        <div className="relative mb-10">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={t`用日常口语描述你的感受...`}
            className="w-full px-4 py-3.5 rounded-2xl border border-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-sm bg-white/80 backdrop-blur-sm"
          />
          <button 
            onClick={() => setIsOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Trans>搜索</Trans>
          </button>
        </div>

        {/* 示例搜索 */}
        <div className="text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5 mb-3">
            💡 <Trans>试试这样搜索：</Trans>
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleSearches.map((example, index) => (
              <button
                key={index}
                onClick={() => setSearchText(example)}
                className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full hover:bg-purple-50 border border-purple-100/50 transition-colors"
              >
                {`"${example}"`}
              </button>
            ))}
          </div>
        </div>

        {/* 功能标签 */}
        <div className="flex justify-center gap-8 mt-12 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🌐</span>
            <span><Trans>支持各种口语表达</Trans></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🔤</span>
            <span><Trans>支持多语言搜索</Trans></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🧠</span>
            <span><Trans>理解情感语境</Trans></span>
          </div>
        </div>
      </div>

      {/* 搜索对话框 */}
      <SearchDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        initialSearch={searchText}
        onSearch={setSearchText}
        exampleSearches={exampleSearches}
      />
    </div>
  )
}
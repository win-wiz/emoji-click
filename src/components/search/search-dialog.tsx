'use client'

import { useEffect, useState } from 'react'
import { Trans } from '@lingui/macro'
import useDebounce from '@/hooks/use-debounce'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  emoji: string
  name: string
  description: string
  category: string
}

// 扩充模拟搜索结果数据
const mockResults: SearchResult[] = [
  { emoji: '😊', name: '开心笑', description: '表达开心愉快', category: '表情符号' },
  { emoji: '😃', name: '大笑', description: '开心大笑', category: '表情符号' },
  { emoji: '😄', name: '笑眼', description: '笑出眼睛', category: '表情符号' },
  { emoji: '😁', name: '露齿笑', description: '开心露齿而笑', category: '表情符号' },
  { emoji: '🤣', name: '笑倒', description: '笑到倒地', category: '表情符号' },
  { emoji: '😂', name: '笑哭', description: '笑出眼泪', category: '表情符号' },
  { emoji: '😅', name: '尴尬笑', description: '尴尬而不失礼貌地笑', category: '表情符号' },
  { emoji: '😆', name: '眯眼笑', description: '开心地眯眼而笑', category: '表情符号' },
  { emoji: '😉', name: '眨眼笑', description: '调皮地眨眼', category: '表情符号' },
  { emoji: '😋', name: '美味笑', description: '美味地笑', category: '表情符号' },
  { emoji: '😎', name: '酷笑', description: '戴墨镜的笑脸', category: '表情符号' },
  { emoji: '🤓', name: '书呆子笑', description: '戴眼镜的呆萌笑', category: '表情符号' },
  { emoji: '🤪', name: '搞怪笑', description: '滑稽搞笑的表情', category: '表情符号' },
  { emoji: '😛', name: '吐舌笑', description: '调皮吐舌头', category: '表情符号' },
  { emoji: '🤗', name: '笑着抱抱', description: '开心地张开双臂', category: '表情符号' },
  { emoji: '🥰', name: '幸福笑', description: '幸福地笑着', category: '情感' },
  { emoji: '😍', name: '爱心笑', description: '笑出爱心眼', category: '情感' },
  { emoji: '🤩', name: '星星眼笑', description: '兴奋地笑出星星眼', category: '情感' },
  { emoji: '😇', name: '天使笑', description: '天使般的微笑', category: '情感' },
  { emoji: '🙂', name: '浅笑', description: '轻轻地微笑', category: '表情符号' },
  { emoji: '🤭', name: '捂嘴笑', description: '害羞地捂嘴笑', category: '表情符号' },
  { emoji: '😌', name: '释然笑', description: '释然地微笑', category: '表情符号' },
  { emoji: '😏', name: '得意笑', description: '得意地笑', category: '表情符号' },
  { emoji: '🙃', name: '倒转笑', description: '倒过来的笑脸', category: '表情符号' },
]

// 推荐表情数据
const recommendedEmojis: SearchResult[] = [
  { emoji: '😊', name: '开心笑', description: '表达开心愉快', category: '表情符号' },
  { emoji: '🎉', name: '庆祝', description: '庆祝祝贺', category: '庆祝' },
  { emoji: '👍', name: '点赞', description: '表示赞同', category: '手势' },
  { emoji: '❤️', name: '红心', description: '表达喜爱', category: '符号' },
  { emoji: '🌟', name: '星星', description: '闪耀光芒', category: '自然' },
]

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  initialSearch: string
  onSearch: (text: string) => void
  exampleSearches: string[]
}

export default function SearchDialog({
  isOpen,
  onClose,
  initialSearch,
  onSearch,
  exampleSearches
}: SearchDialogProps) {
  const router = useRouter()
  const [searchText, setSearchText] = useState(initialSearch)
  const debouncedSearch = useDebounce(searchText, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // 处理复制功能
  const handleCopy = async (emoji: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
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

  // 模拟搜索过程
  useEffect(() => {
    if (!debouncedSearch) {
      setResults([])
      return
    }

    const searchEmojis = async () => {
      setIsLoading(true)
      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟搜索结果
        const filteredResults = mockResults.filter(result => 
          result.name.includes(debouncedSearch) || 
          result.description.includes(debouncedSearch)
        )
        setResults(filteredResults)
      } finally {
        setIsLoading(false)
      }
    }

    searchEmojis()
  }, [debouncedSearch])

  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 处理跳转到详情页
  const handleNavigateToDetails = (emoji: string) => {
    onClose() // 先关闭弹框
    router.push(`/details`) // 然后跳转
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl bg-white p-0 flex flex-col max-h-[85vh]">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* 头部：搜索区域 - 固定在顶部 */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索表情..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              autoFocus
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* 中间：搜索结果区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto p-6 border-b border-gray-100">
          <div className="bg-gray-50/50 rounded-xl p-4">
            <h3 className="text-sm z-10 font-medium text-gray-500 mb-3 px-2 flex items-center justify-between sticky top-0 bg-gray-50/95 py-2 -mt-2 -mx-2 rounded-t-xl">
              <span>
                {isLoading ? (
                  <Trans>搜索中...</Trans>
                ) : results.length > 0 ? (
                  <Trans>搜索结果 ({results.length})</Trans>
                ) : searchText ? (
                  <Trans>未找到相关表情</Trans>
                ) : (
                  <Trans>开始搜索表情</Trans>
                )}
              </span>
              {results.length > 0 && (
                <span className="text-xs text-gray-400">
                  <Trans>按 ESC 关闭</Trans>
                </span>
              )}
            </h3>
            
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors relative"
                  onClick={() => handleNavigateToDetails(result.emoji)}
                >
                  <span className="text-3xl">{result.emoji}</span>

                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-500">{result.description}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopy(result.emoji, index, e)}
                      className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-300"
                      title="复制表情"
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

                    <div className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                      {result.category}
                    </div>
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
          </div>
        </div>

        {/* 底部：推荐区域 - 固定在底部 */}
        <div className="p-6 bg-gray-50/30">
          <div className="space-y-6">
            {/* 示例搜索 */}
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span>
                <Trans>搜索示例</Trans>
              </h3>
              <div className="flex flex-wrap gap-2">
                {exampleSearches.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchText(example)}
                    className="text-sm px-3 py-1.5 rounded-full bg-gray-50 hover:bg-purple-50 border border-gray-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* 推荐表情 */}
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <Trans>推荐表情</Trans>
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {recommendedEmojis.map((emoji, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="text-3xl mb-1">{emoji.emoji}</span>
                    <span className="text-xs text-gray-500 text-center">{emoji.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 模态框背景 */}
      <div className="modal-backdrop bg-black/30 backdrop-blur-sm" onClick={onClose} />
    </dialog>
  )
} 
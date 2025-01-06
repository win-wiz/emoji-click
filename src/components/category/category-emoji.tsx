'use client'

import React from 'react'
import { Trans } from '@lingui/macro'
import { useState, useCallback, useMemo, useEffect, memo, useRef } from 'react'
import SingleEmoji from '@/components/single-emoji'
const CategoryModal = React.lazy(() => import('./category-modal'))
const CategoryNav = React.lazy(() => import('./category-nav'))
import { AVAILABLE_LOCALES } from '@/locales/config'
import { motion, AnimatePresence } from 'framer-motion'
import { debounce } from '@/utils'
import { EmojiType } from '@/types/category'

const ITEMS_PER_PAGE = 30
// const SCROLL_THRESHOLD = 300  // 增大滚动触发阈值，提前加载更多内容

// 分类状态接口
interface CategoryState {
  page: number;
  hasMore: boolean;
  loading: boolean;
  items: any[];
}

// 简化的动画配置
const containerVariants = {
  enter: (direction: number) => ({
    x: direction * 100, // 减小移动距离
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction * -100,
    opacity: 0
  })
}

// 记忆化单个表情项组件
const MemoizedEmojiItem = memo(function EmojiItem({ 
  item, 
  index, 
  lang 
}: { 
  item: any; 
  index: number; 
  lang: AVAILABLE_LOCALES 
}) {
  return (
    <div
      className="opacity-100 animate-[fadeIn_0.3s_ease-in-out_forwards]"
      style={{
        animationDelay: `${Math.min(index * 0.05, 0.5)}s`
      }}
    >
      <SingleEmoji
        emojiItem={item}
        lang={lang}
      />
    </div>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数，只在必要时重��渲染
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.lang === nextProps.lang
  )
})

const CategoryEmoji = React.memo(function CategoryEmoji({
  lang,
  categories = []
}: {
  lang: AVAILABLE_LOCALES 
  categories: Record<string, any>[]
}) {
  // 使用 useMemo 获取默认分类 ID
  const defaultCategoryId = useMemo(() => {
    return categories[0]?.id || 'faces'
  }, [categories])

  const [selectedCategory, setSelectedCategory] = useState<string>(() => defaultCategoryId)
  const [direction, setDirection] = useState(0)
  
  // 修改初始状态设置，使用 defaultCategoryId
  const [categoryStates, setCategoryStates] = useState(() => {
    const initialStates = new Map<string, CategoryState>()
    categories.forEach(category => {
      initialStates.set(category.id, {
        page: 1,
        hasMore: category.emojis.length > ITEMS_PER_PAGE,
        loading: false,
        items: category.emojis.slice(0, ITEMS_PER_PAGE)
      })
    })
    return initialStates
  })

  // 获取前分类数据
  const currentCategory = useMemo(() => 
    categories.find(c => c.id === selectedCategory) ?? categories[0],
    [categories, selectedCategory]
  )

  // 获取当前分类状态
  const currentState = useMemo(() => {
    const state = categoryStates.get(selectedCategory)
    if (!state && currentCategory) {
      return {
        page: 1,
        hasMore: currentCategory.emojis.length > ITEMS_PER_PAGE,
        loading: false,
        items: currentCategory.emojis.slice(0, ITEMS_PER_PAGE)
      }
    }
    return state || { page: 1, hasMore: false, loading: false, items: [] }
  }, [categoryStates, selectedCategory, currentCategory?.emojis])

  // 加载更多数据
  const loadMore = useCallback(() => {
    if (!currentCategory?.emojis || currentState.loading) return

    const nextPage = currentState.page + 1
    const end = ITEMS_PER_PAGE * nextPage
    const hasMoreItems = currentCategory.emojis.length > end

    if (!hasMoreItems) return

    // 先设置 loading 状态
    setCategoryStates(prev => {
      const newStates = new Map(prev)
      newStates.set(selectedCategory, {
        ...(prev.get(selectedCategory) as CategoryState),
        loading: true
      })
      return newStates
    })

    // 模拟数据加载延迟
    setTimeout(() => {
      setCategoryStates(prev => {
        const newStates = new Map(prev)
        newStates.set(selectedCategory, {
          page: nextPage,
          loading: false,
          hasMore: hasMoreItems,
          items: currentCategory.emojis.slice(0, end)
        })
        return newStates
      })
    }, 800)
  }, [currentCategory?.emojis, currentState.loading, currentState.page, selectedCategory])

  const emojiListRef = useRef<HTMLDivElement>(null)

  // 处理滚动
  const handleScroll = useCallback(() => {
    if (currentState.loading) return

    const emojiListBottom = emojiListRef.current?.getBoundingClientRect().bottom ?? Infinity
    const windowBottom = window.innerHeight

    // 当组件底部距离可见区域小于 50px 时触发加载
    if (emojiListBottom - windowBottom < 50 && currentState.hasMore) {
      loadMore()
    }  
  }, [currentState.loading, currentState.hasMore, loadMore])

  // 优化渲染列表
  const renderEmojiList = useMemo(() => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
      {currentState.items.map((item: Record<string, any>, index: number) => (
        <MemoizedEmojiItem
          key={item.id || index}
          item={item}
          index={index}
          lang={lang}
        />
      ))}
    </div>
  ), [currentState.items, lang])

  // 优化滚动处理
  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 150),
    [handleScroll]
  )

  useEffect(() => {
    window.addEventListener('scroll', debouncedScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', debouncedScroll)
      debouncedScroll.cancel?.() // 清理防抖函数
    }
  }, [debouncedScroll])

  // 分类切换时检查
  useEffect(() => {
    handleScroll()
  }, [selectedCategory, handleScroll])

  // 处理分类切换
  const handleCategoryChange = useCallback((newCategoryId: string) => {
    const currentIndex = categories.findIndex(c => c.id === selectedCategory)
    const newIndex = categories.findIndex(c => c.id === newCategoryId)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setSelectedCategory(newCategoryId)
  }, [categories])

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white" />

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 标题和导航部分 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h2 className="text-xl font-medium text-gray-900">
              <Trans>表情分类</Trans>
            </h2>
          </div>
          <React.Suspense fallback={<div>Loading...</div>}>
            <CategoryModal
              categories={categories}
              onChange={handleCategoryChange}
              choicedCategory={selectedCategory}
            />
          </React.Suspense>
        </div>

        <React.Suspense fallback={<div>Loading...</div>}>
          <CategoryNav
            categories={categories as EmojiType[]}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </React.Suspense>

        {/* 表情网格区域 */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              ref={emojiListRef}
              key={selectedCategory}
              custom={direction}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3, // 固定动画时长
                ease: "easeInOut" // 使用简单的缓动函数
              }}
              className="w-full"
            >
              {currentCategory && (
                <div className="space-y-8">
                  {renderEmojiList}
                  {currentState.loading && (
                    <div className="py-4 flex justify-center">
                      {/* 加载动画 */}
                      <div className="flex items-center gap-2 text-primary/70">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <Trans>加载中...</Trans>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>å
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
})

export default CategoryEmoji

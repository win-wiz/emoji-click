'use client'

import { EmojiType } from "@/types/category";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react"

export default function CategoryNav({
  categories,
  selectedCategory,
  onChange
}: {
  categories: EmojiType[];
  selectedCategory: string;
  onChange?: (categoryId: string) => void;
}) {

  const categoriesRef = useRef<HTMLDivElement>(null)
    // 处理滚动
  const handleScroll = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 300
      const newScrollLeft = direction === 'left' 
        ? categoriesRef.current.scrollLeft - scrollAmount
        : categoriesRef.current.scrollLeft + scrollAmount
      
      categoriesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  // 计算需要显示的位置
  const scrollToCategory = (categoryId: string) => {
    setTimeout(() => {
      const element = document.getElementById(`category-${categoryId}`)
      if (element && categoriesRef.current) {
        const container = categoriesRef.current
        const elementRect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        // 计算元素右边缘到容器右边缘的距离
        const distanceToRight = containerRect.right - elementRect.right
        
        // 如果元素右边缘接近或超出容器右边缘，自动滚动以显示下一个元素
        if (distanceToRight < 100) { // 100px 阈值，可以根据需要调整
          const nextScrollPosition = container.scrollLeft + elementRect.width + 16 // 16px 是间距
          container.scrollTo({
            left: nextScrollPosition,
            behavior: 'smooth'
          })
        } else if (elementRect.left < containerRect.left + 100) {
          // 如果元素左边缘接近或超出容器左边缘，向左滚动
          const prevScrollPosition = container.scrollLeft - elementRect.width - 16
          container.scrollTo({
            left: prevScrollPosition,
            behavior: 'smooth'
          })
        }
      }
    }, 100)
  }

  console.log('category===>>', categories)

  return (
    <div className="relative mb-12">
      {/* 左侧导航区域 */}
      <div className="absolute -left-2 top-0 bottom-0 flex items-center z-20">
        <button 
          onClick={() => handleScroll('left')}
          className="relative group p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm"
        >
          {/* 悬浮时的光晕效果 */}
          <div className="absolute inset-0 rounded-full bg-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ChevronLeft className="relative w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>

      {/* 右侧导航区域 */}
      <div className="absolute -right-2 top-0 bottom-0 flex items-center z-20">
        <button 
          onClick={() => handleScroll('right')}
          className="relative group p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm"
        >
          {/* 悬浮时的光晕效果 */}
          <div className="absolute inset-0 rounded-full bg-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ChevronRight className="relative w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"/>
        </button>
      </div>

      {/* 渐变遮罩 - 调整透明度和宽度 */}
      <div className="pointer-events-none absolute left-8 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 via-white/50 to-transparent z-10" />
      <div className="pointer-events-none absolute right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 via-white/50 to-transparent z-10" />

      {/* 类别列表 */}
      <div ref={categoriesRef} className="overflow-auto scrollbar-hide mx-8">
        <div className="flex gap-4 px-3">
          {categories.map((category) => (
            <button
              key={category.id}
              id={`category-${category.id}`}
              onClick={() => {
                scrollToCategory(category.id);
                onChange?.(category.id);
              }}
              className={`group w-[200px] relative flex flex-col items-center min-w-[150px] p-3 rounded-xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gray-100 shadow-sm scale-105 transform'
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* 表情数量徽章 - 改为右上角定位 */}
              <div className="absolute -top-1 -right-1 z-10">
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                }`}>
                  {category.emojis.length}
                </span>
              </div>

              {/* 图标和文字 */}
              <span className={`text-2xl mb-1.5 transition-transform duration-300 ${
                selectedCategory === category.id ? 'scale-110' : ''
              }`}>
                {category.icon || '😊'}
              </span>
              <span className={`text-xs font-medium whitespace-nowrap transition-colors max-w-[60px] overflow-hidden text-ellipsis ${
                selectedCategory === category.id
                  ? 'text-gray-900'
                  : 'text-gray-400 group-hover:text-gray-600'
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
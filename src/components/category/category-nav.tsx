'use client'

import { EmojiType } from "@/types/category";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Trans } from "@lingui/macro";

// 提取导航按钮组件
const NavButton = memo(function NavButton({
  direction,
  onClick
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      className="relative group p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm"
    >
      <div className="absolute inset-0 rounded-full bg-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Icon className="relative w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </button>
  );
});

// 提取分类按钮组件
const CategoryButton = memo(function CategoryButton({
  category,
  isSelected,
  onClick
}: {
  category: EmojiType;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      id={`category-${category.id}`}
      onClick={onClick}
      className={`group w-[200px] relative flex flex-col items-center min-w-[150px] p-3 rounded-xl transition-all duration-300 ${
        isSelected
          ? 'bg-gray-100 shadow-sm scale-105 transform'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="absolute -top-1 -right-1 z-10">
        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium rounded-full transition-colors ${
          isSelected
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
        }`}>
          {category.emojis.length}
        </span>
      </div>

      <span className={`text-2xl mb-1.5 transition-transform duration-300 ${
        isSelected ? 'scale-110' : ''
      }`}>
        {category.icon || '😊'}
      </span>
      <span className={`text-xs font-medium whitespace-nowrap transition-colors max-w-[60px] overflow-hidden text-ellipsis ${
        isSelected
          ? 'text-gray-900'
          : 'text-gray-400 group-hover:text-gray-600'
      }`}>
        {category.name}
      </span>
    </button>
  );
});

export default function CategoryNav({
  categories,
  selectedCategory,
  onChange
}: {
  categories: EmojiType[];
  selectedCategory: string;
  onChange?: (categoryId: string) => void;
}) {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [originalTop, setOriginalTop] = useState<number>(0);
  const prevCategoryRef = useRef(selectedCategory);
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // 记录容器的原始位置
  useEffect(() => {
    const updateOriginalTop = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setOriginalTop(rect.top + scrollTop);
      }
    };

    updateOriginalTop();
    window.addEventListener('resize', updateOriginalTop);
    return () => window.removeEventListener('resize', updateOriginalTop);
  }, []);

  // 监听用户滚动
  useEffect(() => {
    const handleScroll = () => {
      isUserScrolling.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 优化 Intersection Observer 回调
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]) {
      setIsSticky(!entries[0].isIntersecting);
    }
  }, []);

  // 使用 Intersection Observer 检测 sticky 状态
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [1],
      rootMargin: '-1px 0px 0px 0px'
    });

    const sentinel = document.createElement('div');
    Object.assign(sentinel.style, {
      position: 'absolute',
      top: '0',
      height: '1px',
      width: '1px',
      opacity: '0'
    });
    
    containerRef.current.parentElement?.insertBefore(sentinel, containerRef.current);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [observerCallback]);

  // 处理分类切换时的滚动
  useEffect(() => {
    // 只在分类变化且不是用户手动滚动时触发滚动
    if (selectedCategory !== prevCategoryRef.current && isSticky && !isUserScrolling.current) {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offset = 180;

      if (Math.abs(currentScrollTop - (originalTop - offset)) > 5) {
        window.scrollTo({
          top: originalTop - offset,
          behavior: 'smooth'
        });
      }
    }
    prevCategoryRef.current = selectedCategory;
  }, [selectedCategory, isSticky, originalTop]);

  // 优化水平滚动处理函数
  const handleNavClick = useCallback((direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? categoriesRef.current.scrollLeft - scrollAmount
        : categoriesRef.current.scrollLeft + scrollAmount;

      categoriesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  // 优化分类滚动函数
  const scrollToCategory = useCallback((categoryId: string) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(`category-${categoryId}`);
      if (element && categoriesRef.current) {
        const container = categoriesRef.current;
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const distanceToRight = containerRect.right - elementRect.right;
        if (distanceToRight < 100) {
          container.scrollTo({
            left: container.scrollLeft + elementRect.width + 16,
            behavior: 'smooth'
          });
        } else if (elementRect.left < containerRect.left + 100) {
          container.scrollTo({
            left: container.scrollLeft - elementRect.width - 16,
            behavior: 'smooth'
          });
        }
      }
    });
  }, []);

  // 优化分类点击处理函数
  const handleCategoryClick = useCallback((categoryId: string) => {
    scrollToCategory(categoryId);
    onChange?.(categoryId);
  }, [onChange, scrollToCategory]);

  return (
    <div 
      ref={containerRef} 
      className={`
        mb-12 sticky top-20 z-10 bg-white py-5
        ${isSticky ? 'animate-slideDown' : ''}
      `}
    >
      {/* 左侧导航区域 */}
      <div className="absolute -left-2 top-0 bottom-0 flex items-center z-20">
        <NavButton direction="left" onClick={() => handleNavClick('left')} />
      </div>

      {/* 右侧导航区域 */}
      <div className="absolute -right-2 top-0 bottom-0 flex items-center z-20">
        <NavButton direction="right" onClick={() => handleNavClick('right')} />
      </div>

      {/* 渐变遮罩 - 调整透明度和宽度 */}
      <div className="pointer-events-none absolute left-8 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 via-white/50 to-transparent z-10" />
      <div className="pointer-events-none absolute right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 via-white/50 to-transparent z-10" />

      {/* 类别列表 */}
      <div ref={categoriesRef} className="overflow-auto scrollbar-hide mx-8">
        <div className="flex gap-4 px-3">
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
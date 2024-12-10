'use client'

import { Trans } from "@lingui/macro";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

// 定义一个默认类别 ID
const DEFAULT_CATEGORY_ID = ''

export default function CategoryModal({
  categories,
  onChange,
  choicedCategory
}: {
  categories: Record<string, any>[];
  onChange?: (selectNav: string) => void;
  choicedCategory?: string;
}) {

  const [showAllCategories, setShowAllCategories] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(choicedCategory ?? DEFAULT_CATEGORY_ID)

  const handleChange = (selectNav: string) => {
    setSelectedCategory(selectNav);
    onChange?.(selectNav)
  }

  useEffect(() => {
    setSelectedCategory(choicedCategory ?? DEFAULT_CATEGORY_ID)
  }, [choicedCategory])

  return (
    <>
      <button
        onClick={() => setShowAllCategories(true)}
        className="group flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-300"
      >
        <span><Trans>全部分类</Trans></span>
        <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
          {categories.length}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"/>
      </button>

      {/* 全部分类弹出层 */}
      {showAllCategories && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-auto p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🎯</span>
              <h3 className="text-xl flex flex-col  font-medium text-gray-900">
                <Trans>全部表情分类</Trans>
                <span className="py-0.5 text-sm">
                  {categories.length} <Trans>种</Trans>
                  <span className="ml-1 text-gray-400">
                    ({categories.reduce((sum, category) => sum + category.emojis.length, 0)} <Trans>个表情</Trans>)
                  </span>
                </span>
              </h3>
              <button
                onClick={() => setShowAllCategories(false)}
                className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    // setSelectedCategory(category.id)
                    // setShowAllCategories(false)
                    const element = document.getElementById(`category-${category.id}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }
                    handleChange(category.id);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gray-100 shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                  <div className="flex flex-col items-start">
                    <div 
                      className={`font-medium text-left leading-5 max-w-[100px] overflow-hidden text-ellipsis ${
                        selectedCategory === category.id
                          ? 'text-gray-900'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    >
                      {category.name}
                    </div>
                    <span className="text-xs text-gray-400 mt-2">
                      {category.emojis.length} <Trans>个表情</Trans>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
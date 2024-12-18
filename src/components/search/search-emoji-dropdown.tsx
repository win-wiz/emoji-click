import { t, Trans } from "@lingui/macro";
import { memo, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { EmojiType } from "@/types/emoji";
import clsx from "clsx";
import { useToast } from '@/components/ui/use-toast'
import { ArrowUpRight, X, Loader2 } from 'lucide-react'
import { AVAILABLE_LOCALES } from "@/locales/config";
import Link from "next/link";
import { useForm } from 'react-hook-form'

// 抽离常量
// const DEBOUNCE_DELAY = 800;
const HIDE_DELAY = 200;
const TOAST_DURATION = 1500;

interface SearchForm {
  keyword: string;
}

// 抽离 EmojiItem 组件
const EmojiItem = memo(function EmojiItem({
  emoji,
  onCopy,
  lang,
}: {
  emoji: EmojiType;
  onCopy: (code: string) => void;
  lang: AVAILABLE_LOCALES;
}) {
  const handleClick = useCallback(() => {
    onCopy(emoji.code);
  }, [emoji.code, onCopy]);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="group flex items-center justify-between px-4 py-3 hover:bg-purple-50/70 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center justify-center w-12 h-12 text-4xl bg-purple-50/50 rounded-lg">
          {emoji.code}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-gray-700 truncate">
              {emoji.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-md border border-purple-100/50">
                {emoji.typeName || emoji.type}
              </span>
              {emoji.hot === 1 && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs bg-red-50 text-red-600 rounded-md border border-red-100/50">
                  <span className="mr-0.5">🔥</span>
                  <Trans>热门</Trans>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
        <button
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100/80 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onCopy(emoji.code)
          }}
          title={t`复制`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
        
        {/* 跳转至详情 */}
        {
          emoji.fullCode && (
            <Link
              href={`/${lang}/${emoji.fullCode}`}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100/80 rounded-lg transition-colors"
              onClick={handleLinkClick}
              title={t`查看详情`}
        >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )
        }
      </div>
    </div>
  );
});

EmojiItem.displayName = 'EmojiItem';

const SearchEmojiDropdown = memo(function SearchEmojiDropdown({
  initText,
  lang,
}: {
  initText: string;
  lang: AVAILABLE_LOCALES;
}) {
  const { register, handleSubmit, reset } = useForm<SearchForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [emojis, setEmojis] = useState<EmojiType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>(initText);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasResults = emojis.length > 0;
  const { toast } = useToast();

  // 使用 useMemo 优化搜索按钮的类名
  const searchButtonClassName = useMemo(() => 
    clsx(
      "px-6 py-2 rounded-xl transition-all duration-200",
      "bg-purple-600 text-white hover:bg-purple-700",
      "flex items-center gap-2",
      isLoading && "!bg-purple-500 cursor-not-allowed"
    ),
    [isLoading]
  );

  // 使用 useCallback 优化事件处理函数
  const handleClearClick = useCallback(() => {
    setSearchText('');
    reset(); // 重置表单的值
    setEmojis([]);
    setIsOpen(false);
  }, [reset]);

  const handleSearch = useCallback(async (data: SearchForm) => {
    setIsLoading(true); // 在开始搜索时设置加载状态
    setError(null);
    setEmojis([]);
    setIsOpen(false);

    try {
      const response: Record<string, any> = await fetch(`${lang}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const { results, status } = await response.json();

      if (status === 200) {
        setEmojis(results);
        setIsOpen(true);
      } else {
        throw new Error('Invalid data format');
      }
      
    } catch (err) {
      setError(t`搜索出错，请稍后重试`);
      setEmojis([]);
    } finally {
      setIsLoading(false); // 在结束搜索时重置加载状态
    }
  }, [lang]);

  const onSubmit = useCallback((data: SearchForm) => {
    if (data.keyword.trim() === '') {
      return;
    }
    handleSearch(data);
  }, [handleSearch]);

  useEffect(() => {
    if (initText) {
      setSearchText(initText);
      handleSearch({ keyword: initText });
    }
  }, [initText, handleSearch]);

  // 添加 handleMouseEnter 和 handleMouseLeave 函数
  const handleMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (hasResults) {
      setIsOpen(true);
    }
  }, [hasResults]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    try {
      const relatedTarget = e.relatedTarget; // 不进行类型转换
      // 检查 relatedTarget 是否是 Node 类型
      if (relatedTarget instanceof Node && containerRef.current?.contains(relatedTarget)) {
        return;
      }
    } catch (error) {
      console.error('handleMouseLeave error', error);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, HIDE_DELAY);
  }, []);

  // 优化复制功能
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: t`已复制到剪贴板`,
        duration: TOAST_DURATION,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: t`复制失败，请重试`,
        duration: TOAST_DURATION,
      });
    }
  }, [toast]);

  return (
    <div 
      className="relative mb-10" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative group flex items-center">
          <input
            type="text"
            {...register('keyword')}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value); // 更新输入框的值
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // 阻止默认行为
                onSubmit({ keyword: searchText }); // 直接调用 onSubmit
              }
            }}
            placeholder={t`用日常口语描述你的感受，回车或点击...`}
            className="w-full px-4 py-3.5 rounded-2xl border border-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-sm bg-white/80 backdrop-blur-sm"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {searchText && (
              <button
                onClick={handleClearClick}
                type="button"
                className="p-2 rounded-full mr-1 text-gray-400
                  hover:text-gray-500 hover:bg-gray-100/80 transition-all duration-200
                  opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="清空"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              className={searchButtonClassName}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span><Trans>搜索中</Trans></span>
                </>
              ) : (
                <span><Trans>搜索</Trans></span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 搜索结果下拉框 */}
      {isOpen && hasResults && (
        <div 
          className="absolute w-full mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 max-h-[400px] overflow-y-auto z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {error ? (
            <div className="p-4 text-red-500 text-center">{error}</div>
          ) : emojis.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              <Trans>没有找到相关表情</Trans>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {emojis.map((emoji, index) => (
                <EmojiItem
                  key={emoji.fullCode || `emoji_ai_${index}`}
                  emoji={emoji}
                  onCopy={copyToClipboard}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SearchEmojiDropdown.displayName = 'SearchEmojiDropdown';

export default SearchEmojiDropdown;

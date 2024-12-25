import { t, Trans } from "@lingui/macro";
import { memo, useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { EmojiType } from "@/types/emoji";
// import clsx from "clsx";
import { useToast } from '@/components/ui/use-toast'
import { ArrowUpRight, X, Loader2 } from 'lucide-react'
import { AVAILABLE_LOCALES } from "@/locales/config";
import Link from "next/link";
import { useForm } from 'react-hook-form'

// 抽离常量
// const DEBOUNCE_DELAY = 800;
const HIDE_DELAY = 200;
const TOAST_DURATION = 1500;

const SEARCH_BUTTON_LOADING = 'px-4 py-2 rounded-lg bg-purple-500 text-white flex items-center justify-center space-x-1 opacity-80';
const SEARCH_BUTTON_NORMAL = 'px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white flex items-center justify-center space-x-1 transition-colors duration-200';

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

const EmojiItemMemo = memo(EmojiItem);

const LoadingIcon = () => (
  <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      className="opacity-75" 
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

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
  // const hasResults = emojis.length > 0;
  const { toast } = useToast();

  const searchButtonClassName = useMemo(() => 
    isLoading ? SEARCH_BUTTON_LOADING : SEARCH_BUTTON_NORMAL,
    [isLoading]
  );

  const handleClearClick = useCallback(() => {
    setSearchText('');
    reset();
    setEmojis([]);
    setError(null);
  }, [reset]);

  const handleSearch = useCallback(async (data: SearchForm) => {
    setIsLoading(true); // 在开始搜索时设置加载状态 
    setError(null);
    setEmojis([]);
    setIsOpen(true); // 显示下拉框

    // console.log('data===>>>', data);
    try {
      const response: Record<string, any> = await fetch(`${lang}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // console.log('response===>>>', await response.json());
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

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hideTimeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      if (!isLoading) setIsOpen(false);
    }, 200);
  }, [isLoading]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
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
              setSearchText(e.target.value); // 更新输入
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
      {isOpen && (
        <div 
          className="absolute w-full mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 max-h-[400px] overflow-y-auto z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading ? (
            <div className="p-4 flex flex-col items-center justify-center space-y-2">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center animate-spinnerRotate">
                  <svg className="w-full h-full" viewBox="0 0 50 50">
                    <circle
                      className="stroke-purple-400 animate-spinnerDash from-purple-400 to-indigo-400"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-spinnerRotateReverse animation-delay-1000">
                  <svg className="w-3/4 h-3/4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path className="stroke-purple-300" d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full animate-innerCircleColors"></div>
                </div>
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
                    <div className="absolute top-0 -left-6 text-2xl animate-bounce">😊</div>
                    <div className="absolute bottom-0 -right-6 text-2xl animate-spin">💖</div>
                  </div>
                </div> */}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">{error}</div>
          ) : emojis.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              <Trans>没有找到相关表情</Trans>  
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {emojis.map((emoji, index) => (
                <EmojiItemMemo
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

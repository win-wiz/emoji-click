import { t, Trans } from "@lingui/macro";
import { memo, useCallback, useMemo } from "react";

interface ExampleSearchProps {
  setSearchText: (text: string) => void;
}

// 使用 const 声明组件
const EmojiSearchExample = memo(function EmojiSearchExample({ setSearchText }: ExampleSearchProps) {
  // 使用 useMemo 缓存示例搜索数组，避免每次渲染重新创建
  const exampleSearches = useMemo(() => [
    t`今天心情特别好`,
    t`想表达谢谢但点赞室`,
    t`不想上班好累啊`,
    t`老板等我了开开心`,
    t`朋友生日想祝福`,
    t`工作完成啦好棒`,
    t`困得不行了`
  ], []);

  // 使用 useCallback 缓存点击处理函数
  const handleClick = useCallback((example: string) => {
    setSearchText(example);
  }, [setSearchText]);

  return (    
    <div className="text-sm text-gray-500">
      <span className="inline-flex items-center gap-1.5 mb-3">
        💡 <Trans>试试这样搜索：</Trans>
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {/* 使用示例文本作为 key 以确保唯一性 */}
        {exampleSearches.map((example) => (
          <button
            key={example}
            onClick={() => handleClick(example)}
            className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full hover:bg-purple-50 border border-purple-100/50 transition-colors"
          >
            {`"${example}"`}
          </button>
        ))}
      </div>
    </div>
  );
}) as React.ComponentType<ExampleSearchProps>;  // 添加类型断言

export default EmojiSearchExample;
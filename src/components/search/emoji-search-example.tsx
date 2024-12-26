import { Trans } from "@lingui/macro";
import { RefreshCw } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface ExampleSearchProps {
  setSearchText: (text: string) => void;
  onRefresh?: () => void;
  randomKeywords: Record<string, any>[];
}

// 使用 const 声明组件
const EmojiSearchExample = memo(function EmojiSearchExample({ setSearchText, randomKeywords = [], onRefresh }: ExampleSearchProps) {
  // 使用 useMemo 缓存示例搜索数组，避免每次渲染重新创建
  const exampleSearches = useMemo(() => [
    ...randomKeywords,
  ], [randomKeywords]);

  // 使用 useCallback 缓存点击处理函数
  const handleClick = useCallback((example: string) => {
    setSearchText(example);
  }, [setSearchText]);

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  return (    
    <div className="text-sm text-gray-500">
      <div className="inline-flex items-center gap-1.5 mb-3">
        💡 <Trans>试试这样搜索：</Trans>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          key={exampleSearches?.join(",")}
        >
          <RefreshCw 
            className="w-6 h-6 p-1 cursor-pointer hover:text-purple-500 transition-all duration-300 hover:bg-gray-100"
            onClick={handleRefresh}
          />
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {exampleSearches.map((example) => (
          <motion.button
            key={example.content}
            onClick={() => handleClick(example.content)}
            className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-100/50 
                transition duration-300 ease-in-out 
                hover:bg-purple-50 hover:-translate-y-1 hover:shadow-lg"
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {example.content}
          </motion.button>
        ))}
      </div>
    </div>
  );
}) as React.ComponentType<ExampleSearchProps>;  // 添加类型断言

export default EmojiSearchExample;
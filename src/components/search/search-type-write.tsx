import { memo } from "react";
import LandingTypeWrite from "./landing-type-write";
import { t } from "@lingui/macro";

{/* 使用打字效果组件 */}
const SearchTypeWrite = memo(function SearchTypeWrite() {

  return (
    <div className="text-gray-600 mb-12 h-8 text-lg bg-gradient-to-r from-purple-600/80 to-purple-500/80 bg-clip-text text-transparent">
      <LandingTypeWrite 
        texts={[
          t`用最自然的方式描述，AI 懂你想表达的每一种情绪`,
          t`描述你的心情，让 AI 帮你找到合适的表情`,
          t`简单输入文字，快速找到想要的表情`
        ]}
        typingSpeed={80}
        deletingSpeed={40}
        pauseTime={3000}
      />
    </div>
  )
});

SearchTypeWrite.displayName = 'SearchTypeWrite';

export default SearchTypeWrite;
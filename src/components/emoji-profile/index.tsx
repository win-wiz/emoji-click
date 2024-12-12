'use client';

import { useState } from "react";
import EmojiCode from "./emoji-code";
import EmojiMeaning from "./emoji-meaning";
import EmojiKeywords from "./emoji-keywords";
import EmojiCultura from "./emoji-cultura";
import EmojiScene from "./emoji-scene";

interface EmojiDetail {
  emojiData: Record<string, any>
}

export default function EmojiProfile({ emojiData = {} }: EmojiDetail) {
  const [copied, setCopied] = useState(false);
  console.log(emojiData)

  return (
    <div className="min-h-screen">
      
      <EmojiCode code={emojiData.code} name={emojiData.name} />
      {/* 主要内容区域 */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 基本含义 - 大号展示 */}
        <EmojiMeaning meaning={emojiData.meaning} />

        {/* 搜索关键词区域 - 创新布局 */}
        <EmojiKeywords keywords={emojiData.keywords} searchTips={emojiData.searchTips} />

        {/* 使用场景和文化差异 */}
        <EmojiCultura 
          eastAsia={emojiData.easterCulturalUsage} 
          westAsia={emojiData.westernCulturalUsage}
          crossCulturalUsage={emojiData.crossCulturalUsage}
        />

        {/* 使用场景 */}
        <EmojiScene social={emojiData.socialSetting} work={emojiData.workSetting} />
      </div>
    </div>
  );
}
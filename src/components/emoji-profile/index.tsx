import EmojiCode from "./emoji-code";
import EmojiMeaning from "./emoji-meaning";
import EmojiKeywords from "./emoji-keywords";
import EmojiCultura from "./emoji-cultura";
import EmojiScene from "./emoji-scene";
import EmojiExample from "./emoji-example";
import EmojiRecommand from "./emoji-recommand";
import { AVAILABLE_LOCALES } from "@/locales/config";

interface EmojiDetail {
  emojiData: Record<string, any>
  lang: AVAILABLE_LOCALES
}

export default function EmojiProfile({ emojiData = {}, lang }: EmojiDetail) {
  // const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen">
      
      <EmojiCode code={emojiData.code} name={emojiData.name} />
      {/* 主要内容区域 */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 基本含义 - 大号展示 */}
        <EmojiMeaning meaning={emojiData.meaning} />

        {/* 使用事例 */}
        {emojiData.usageExample && (
          <EmojiExample examples={emojiData.usageExample} />
        )}

        {/* 搜索关键词区域 - 创新布局 */}
        {emojiData.keywords && (
          <EmojiKeywords keywords={emojiData.keywords} searchTips={emojiData.searchTips} />
        )}

        {/* 使用场景和文化差异 */}
        {emojiData.easterCulturalUsage && emojiData.westernCulturalUsage && emojiData.crossCulturalUsage && (
          <EmojiCultura 
            eastAsia={emojiData.easterCulturalUsage} 
            westAsia={emojiData.westernCulturalUsage}
            crossCulturalUsage={emojiData.crossCulturalUsage}
          />
        )}

        {/* 使用场景 */}
        {emojiData.socialSetting && emojiData.workSetting && (
          <EmojiScene social={emojiData.socialSetting} work={emojiData.workSetting} />
        )}
        
        {/* 相关推荐 */}
        {emojiData.recommands && (
          <EmojiRecommand recommands={emojiData.recommands ?? []} lang={lang}/>
        )}
      </div>
    </div>
  );
}
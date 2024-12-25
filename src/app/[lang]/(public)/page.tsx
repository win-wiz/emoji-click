import { SearchEmoji } from '@/components/search/search-emoji';
import { t } from '@lingui/macro'
import { Metadata } from 'next'
import { HotEmoji } from '@/components/hot-emoji';
import CategoryEmoji from '@/components/category/category-emoji';
import { activateLocale } from '@/locales/locale';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { fetchEmojiByGroup, fetchHotEmoji, fetchRandomKeywords } from '@/server/home';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { lang: AVAILABLE_LOCALES } }): Promise<Metadata> {

  await activateLocale(params.lang)

  return {
    title: t`Emoji AI Finder | 为每一次聊天提供智能表情搜索`,
    description: t`寻找合适的表情符号？只需输入你的感受，Emoji AI Finder会迅速为你找到最佳表情。快速、有趣，总是恰到好处。`,
    keywords: t`emoji search, AI-powered emoji, Emoji AI Finder, smart emoji tool, contextual emoji, emoji discovery, chat enhancement, emoji recommendation engine`,
  }
}

export default async function HomePage({ params }: { params: { lang: AVAILABLE_LOCALES } }) {

  // 查找热门表情
  const hotEmoji = await fetchHotEmoji(params.lang);
  
  // 查找分类表情 
  const emojiByGroup = await fetchEmojiByGroup(params.lang);

  // 随机查找10个关键词
  const randomKeywords = await fetchRandomKeywords(params.lang);

  return (
    <div className="px-4">
      <SearchEmoji randomKeywords={randomKeywords.data ?? []} lang={params.lang}/>
      
      {/* 热门表情  */}
      <HotEmoji lang={params.lang} hotEmojis={hotEmoji.data ?? []} />

      {/* 表情分类 */}
      <CategoryEmoji lang={params.lang} categories={emojiByGroup.data ?? []}/>

    </div>
  )
}

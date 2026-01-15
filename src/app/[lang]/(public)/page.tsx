import { SearchEmoji } from '@/components/search/search-emoji';
// import { t } from '@lingui/macro'
// import { Metadata } from 'next'
import { HotEmoji } from '@/components/hot-emoji';
import CategoryEmoji from '@/components/category/category-emoji';
import AdSenseAd from '@/components/adsense-ad';
// import { activateLocale } from '@/locales/locale';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { fetchEmojiByGroup, fetchHotEmoji, fetchRandomKeywords } from '@/server/home';
import FAQ from '@/components/faq';
import { env } from '@/env';

export const runtime = 'edge';
export const revalidate = 86400; // 24小时重新验证一次，减少 CPU 消耗
export const dynamic = 'force-static'; // 尽量静态生成
export const fetchCache = 'force-cache'; // 强制缓存


export default async function HomePage({ params }: { params: { lang: AVAILABLE_LOCALES } }) {

  // 查找热门表情
  const hotEmoji = await fetchHotEmoji(params.lang);
  
  // 查找分类表情 
  const emojiByGroup = await fetchEmojiByGroup(params.lang);

  // 随机查找10个关键词
  const randomKeywords = await fetchRandomKeywords(params.lang);

  return (
    <>
      <SearchEmoji randomKeywords={randomKeywords.data ?? []} lang={params.lang}/>
      {/* 热门表情  */}
      <HotEmoji lang={params.lang} hotEmojis={hotEmoji.data ?? []} />

      {env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ? (
        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <AdSenseAd slot={env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} minHeight={180} />
        </div>
      ) : null}

      {/* 表情分类 */}
      <CategoryEmoji lang={params.lang} categories={emojiByGroup.data ?? []}/>

      {/* FAQ */}
      <FAQ />
    </>
  )
}

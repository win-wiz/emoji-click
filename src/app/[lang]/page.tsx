import { SearchEmoji } from '@/components/search-emoji';
import { t } from '@lingui/macro'
import { Metadata } from 'next'
import { HotEmoji } from '@/components/hot-emoji';
import CategoryEmoji from '@/components/category/category-emoji';
import { activateLocale } from '@/locales/locale';
import { AVAILABLE_LOCALES } from '@/locales/config';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { lang: AVAILABLE_LOCALES } }): Promise<Metadata> {

  await activateLocale(params.lang)

  return {
    title: t`auto-i18n-next-lingui-tiny-demo, add a new language to your website in 5 minutes`,
    description: t`Use Lingui to add a new language to your website in 5 minutes with AI`,
  }
}

export default function HomePage({ params }: { params: { lang: AVAILABLE_LOCALES } }) {

  return (
    <div className="px-4">
      <SearchEmoji />
      
      {/* 热门表情  */}
      <HotEmoji lang={params.lang} />

      {/* 表情分类 */}
      <CategoryEmoji lang={params.lang} />

    </div>
  )
}

import { SearchEmoji } from '@/components/search-emoji';
import { canonicalUrl, getI18nInstance } from '@/i18n'
import { t } from '@lingui/macro'
import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { HotEmoji } from '@/components/hot-emoji';
import CategoryEmoji from '@/components/category-emoji';

export const runtime = 'edge';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const i18n = getI18nInstance(params.lang)

  return {
    title: t(i18n)`auto-i18n-next-lingui-tiny-demo, add a new language to your website in 5 minutes`,
    description: t(i18n)`Use Lingui to add a new language to your website in 5 minutes with AI`,
    alternates: {
      canonical: canonicalUrl('/', params.lang),
    },
  }
}

export default function HomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang
  const i18n = getI18nInstance(lang)
  setI18n(i18n)

  return (
    <main className="min-h-screen w-full px-4">
      <SearchEmoji />
      {/* 热门表情  */}
      <HotEmoji />
      {/* 表情分类 */}
      <CategoryEmoji />
    </main>
  )
}

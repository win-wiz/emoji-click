
import EmojiProfile from "@/components/emoji-profile";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { fetchEmojiProfileByFullCode, fetchGenerateMetadata } from "@/server/detail";
import { t } from "@lingui/macro";
import { Metadata } from "next";

export const runtime = 'edge';
export const revalidate = 86400 * 7; // 7天重新验证，表情详情页数据基本不变
export const dynamic = 'force-static'; // 尽量静态生成
export const fetchCache = 'force-cache'; // 强制缓存

export async function generateMetadata({ 
  params, 
}: { 
  params: { lang: AVAILABLE_LOCALES, slug: string }
}): Promise<Metadata> {

  const { data } = await fetchGenerateMetadata(params.lang, params.slug);

  return {
    title: `EmojiClick | ${data?.code} | ${data?.name} emoji`,
    description: data?.meaning,
    keywords: t`emoji search, AI-powered emoji, EmojiClick, smart emoji tool, contextual emoji, emoji discovery, chat enhancement, emoji recommendation engine`
  } 
}

export default async function DetailsPage({
  params: {
    lang, 
    slug
  }
}: {
  params: {
    lang: AVAILABLE_LOCALES,
    slug: string
  }
}) {

  if (!slug) {
    return <div>No emoji found</div>
  }

  const emojiData = await fetchEmojiProfileByFullCode(slug, lang);

  return (
    <EmojiProfile emojiData={emojiData.data || {}} lang={lang} />
  )
}


import EmojiProfile from "@/components/emoji-profile";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { fetchEmojiProfileByFullCode, fetchGenerateMetadata } from "@/server/detail";
import { t } from "@lingui/macro";
import { Metadata } from "next";

export const runtime = 'edge';

export async function generateMetadata({ params, searchParams }: { params: { lang: AVAILABLE_LOCALES }, searchParams: { slug: string } }): Promise<Metadata> {

  const { data } = await fetchGenerateMetadata(params.lang, searchParams.slug);

  return {
    title: `Emoji AI Finder | ${data?.name} `,
    description: data?.meaning,
    keywords: t`emoji search, AI-powered emoji, Emoji AI Finder, smart emoji tool, contextual emoji, emoji discovery, chat enhancement, emoji recommendation engine`
  }
  
}

export default async function DetailsPage({
  searchParams: {
    slug
  },
  params: {
    lang
  }
}: {
  searchParams: {
    slug: string
  }
  params: {
    lang: AVAILABLE_LOCALES
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


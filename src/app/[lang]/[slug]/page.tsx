import EmojiProfile from "@/components/emoji-profile";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { fetchEmojiProfileByFullCode } from "@/server/detail";

export const runtime = 'edge';

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
    <EmojiProfile emojiData={emojiData.data || {}} />
  )
}


import { Trans } from "@lingui/macro"
import EmojiSectionTitle from "./emoji-section-title"
import { memo } from "react"
import SingleEmoji from "@/components/single-emoji"
import { AVAILABLE_LOCALES } from "@/locales/config"

const EmojiRecommand = memo(function EmojiRecommand({
  recommands,
  lang
}: {
  recommands: string[],
  lang: AVAILABLE_LOCALES
}) {
  return (
    <section className="relative mb-16 text-center">
      <EmojiSectionTitle>
        <Trans>相关推荐</Trans>
      </EmojiSectionTitle>
      <div className="relative mt-8 max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        {/* {recommands.map((recommand) => <SingleEmoji emojiItem={recommand} lang={lang} />)} */}
      </div>
    </section>
  )
})

EmojiRecommand.displayName = 'EmojiRecommand'

export default EmojiRecommand

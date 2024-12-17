import { Trans } from "@lingui/macro"
import EmojiSectionTitle from "./emoji-section-title"
import { memo } from "react"
import SingleEmoji from "@/components/single-emoji"
import { AVAILABLE_LOCALES } from "@/locales/config"

const EmojiRecommand = memo(function EmojiRecommand({
  recommands,
  lang
}: {
  recommands: Record<string, any>[],
  lang: AVAILABLE_LOCALES
}) {
  return (
    <section className="relative mb-16 text-center">
      <EmojiSectionTitle>
        <Trans>相关推荐</Trans>
      </EmojiSectionTitle>
      <div className="flex justify-center mt-8 max-w-3xl mx-auto space-x-4">
        {recommands.map((recommand, index) => (
          <SingleEmoji key={index} emojiItem={recommand} lang={lang} />
        ))}
      </div>
    </section>
  )
})

EmojiRecommand.displayName = 'EmojiRecommand'

export default EmojiRecommand

import { memo, useMemo } from "react"
import EmojiSectionTitle from "./emoji-section-title"
import { Trans } from "@lingui/macro"

const EmojiScene = memo(function EmojiScene({
  social,
  work,
}: {
  social: string;
  work: string;
}) {
  // 使用 useMemo 缓存卡片内容，避免不必要的重渲染
  const socialCard = useMemo(() => (
    <div className="bg-violet-50/30 rounded-xl p-6 text-left">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex text-xl leading-none">💬</span>
        <h3 className="text-sm font-medium text-violet-600">
          <Trans>社交场景</Trans>
        </h3>
      </div>
      <h4 className="text-sm text-violet-900/70 leading-relaxed space-y-2">
        {social}
      </h4>
    </div>
  ), [social])

  const workCard = useMemo(() => (
    <div className="bg-emerald-50/30 rounded-xl p-6 text-left">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex text-xl leading-none">💼</span>
        <h3 className="text-sm font-medium text-emerald-600">
          <Trans>工作场景</Trans>
        </h3>
      </div>
      <h4 className="text-sm text-emerald-900/70 leading-relaxed space-y-2">
        {work}
      </h4>
    </div>
  ), [work])

  return (
    <section className="relative mb-16 text-center">
      <EmojiSectionTitle>
        <Trans>使用场景</Trans>
      </EmojiSectionTitle>

      <div className="relative mt-8 max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        {socialCard}
        {workCard}
      </div>
    </section>
  )
})

EmojiScene.displayName = 'EmojiScene'

export default EmojiScene

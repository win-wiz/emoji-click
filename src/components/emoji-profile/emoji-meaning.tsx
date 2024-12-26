'use client'

import { Trans } from "@lingui/macro"
import { memo } from "react"
import EmojiSectionTitle from "./emoji-section-title"

// 内容组件
const Content = memo(function Content({ 
  meaning 
}: { 
  meaning: string 
}) {
  return (
    <div className="relative group">
      {/* 装饰背景 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute -inset-4 bg-[radial-gradient(circle_at_50%_50%,transparent_45%,var(--primary-rgb,124,58,237)_46%,transparent_47%)] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700" />
      </div>
      
      {/* 内容区域 */}
      <div className="relative bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm rounded-[2rem] p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
        <div className="absolute inset-px rounded-[2rem] bg-gradient-to-br from-primary/[0.08] to-purple-500/[0.08] opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* 装饰角标 */}
        <div className="absolute -top-1 -right-1 w-6 h-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-br-xl blur group-hover:blur-md transition-all duration-500" />
        </div>
        
        <p className="relative text-base md:text-xl leading-relaxed prose prose-zinc max-w-none prose-p:text-gray-600">
          {meaning}
        </p>
      </div>
    </div>
  )
})

Content.displayName = 'Content'

// 主组件
const EmojiMeaning = memo(function EmojiMeaning({
  meaning,
}: {
  meaning: string
}) {
  return (
    <section className="relative mb-24 text-center max-w-3xl mx-auto px-8">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--primary-rgb,124,58,237)_0%,transparent_70%)] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,var(--primary-rgb,124,58,237)_0%,transparent_50%)] opacity-[0.02]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,var(--primary-rgb,124,58,237)_0%,transparent_50%)] opacity-[0.02]" />
      </div>

      <EmojiSectionTitle>
        <Trans>基本含义</Trans>
      </EmojiSectionTitle>
      <Content meaning={meaning} />

    </section>
  )
})

EmojiMeaning.displayName = 'EmojiMeaning'

export default EmojiMeaning
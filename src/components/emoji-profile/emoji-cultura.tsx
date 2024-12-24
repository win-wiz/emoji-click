'use client'

import { memo, useMemo } from "react"
import EmojiSectionTitle from "./emoji-section-title"
import { Trans, t } from "@lingui/macro"

// 定义配置类型
type CultureConfigType = {
  icon: string;
  title: React.ReactNode;
  bgColor: string;
  textColor: string;
  dotColor: string;
  contentColor: string;
}

// 抽离常量配置
const CULTURE_CONFIG: Record<'east' | 'west', CultureConfigType> = {
  east: {
    icon: '🏮',
    title: <Trans>东方文化解读</Trans>,
    bgColor: 'bg-indigo-50/30',
    textColor: 'text-indigo-600',
    dotColor: 'text-indigo-400',
    contentColor: 'text-indigo-900/70'
  },
  west: {
    icon: '🏛️',
    title: <Trans>西方文化解读</Trans>,
    bgColor: 'bg-amber-50/30',
    textColor: 'text-amber-600',
    dotColor: 'text-amber-400',
    contentColor: 'text-amber-900/70'
  }
} as const

// 抽离列表项组件
const CultureListItem = memo(function CultureListItem({
  content,
  dotColor,
  contentColor
}: {
  content: string;
  dotColor: string;
  contentColor: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`inline-flex ${dotColor} text-base leading-relaxed`}>•</span>
      <h4 className={`flex-1 leading-relaxed ${contentColor}`}>{content}</h4>
    </li>
  )
})

// 抽离文化解读区块组件
const CultureSection = memo(function CultureSection({
  config,
  contents
}: {
  config: CultureConfigType;
  contents: string;
}) {
  const contentList = useMemo(() => contents?.split('\n'), [contents])

  return (
    <div className={`${config.bgColor} rounded-xl p-6 text-left`}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex text-xl leading-none">{config.icon}</span>
        <h3 className={`text-sm font-medium ${config.textColor}`}>{config.title}</h3>
      </div>
      <ul className="space-y-2.5 text-sm">
        {contentList?.map((item, index) => (
          <CultureListItem
            key={index}
            content={item}
            dotColor={config.dotColor}
            contentColor={config.contentColor}
          />
        ))}
      </ul>
    </div>
  )
})

// 抽离跨文化建议组件
const CrossCulturalAdvice = memo(function CrossCulturalAdvice({
  advice
}: {
  advice: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-blue-50/30 rounded-xl px-6 py-4">
      <span className="inline-flex text-xl leading-none mt-0.5">🌏</span>
      <div className="flex-1 text-left">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-blue-600">
            <Trans>跨文化使用建议</Trans>
          </h3>
        </div>
        <h4 className="text-sm text-blue-900/70 leading-relaxed">
          {advice}
        </h4>
      </div>
    </div>
  )
})

const EmojiCultura = memo(function EmojiCultura({
  eastAsia,
  westAsia,
  crossCulturalUsage,
}: {
  eastAsia: string;
  westAsia: string;
  crossCulturalUsage: string;
}) {
  return (
    <section className="relative mb-16 text-center">
      <EmojiSectionTitle>
        <Trans>文化差异解读</Trans>
      </EmojiSectionTitle>

      <div className="relative mt-8 max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        <CultureSection config={CULTURE_CONFIG.east} contents={eastAsia} />
        <CultureSection config={CULTURE_CONFIG.west} contents={westAsia} />
      </div>

      <div className="mt-6 max-w-3xl mx-auto">
        <CrossCulturalAdvice advice={crossCulturalUsage} />
      </div>
    </section>
  )
})

EmojiCultura.displayName = 'EmojiCultura'

export default EmojiCultura

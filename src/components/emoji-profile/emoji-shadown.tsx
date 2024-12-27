'use client';

import { memo } from 'react'

// 抽离样式常量
const SHADOW_STYLES = {
  container: "absolute bottom-0 left-0 right-0",
  gradient: "h-32 bg-gradient-to-t from-white to-transparent",
  line: "absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm"
} as const

const EmojiShadow = memo(function EmojiShadow() {
  return (
    <div className={SHADOW_STYLES.container}>
      <div className={SHADOW_STYLES.gradient} />
      <div className={SHADOW_STYLES.line} />
    </div>
  )
})

EmojiShadow.displayName = 'EmojiShadow'

export default EmojiShadow
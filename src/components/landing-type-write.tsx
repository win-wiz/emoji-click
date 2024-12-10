"use client";
import { useEffect, useState } from 'react'
import { Trans } from '@lingui/macro'
import { AVAILABLE_LOCALES } from '@/locales/config'

interface Props {
  lang: AVAILABLE_LOCALES
  texts?: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

export default function LandingTypeWrite({
  lang,
  texts = [
    '用最自然的方式描述，AI 懂你想表达的每一种情绪',
    'AI understands every emotion you want to express',
    '最も自然な方法で、AIはあなたの感情を理解します',
  ],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}: Props) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!texts.length) return
    const safeIndex = currentIndex % texts.length
    const currentText = texts[safeIndex]

    if (!currentText) return

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, pauseTime)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deletingSpeed)
      } else {
        setIsTyping(true)
        setCurrentIndex((prev) => (prev + 1) % texts.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, currentIndex, isTyping, texts, typingSpeed, deletingSpeed, pauseTime])

  return (
    <div className="h-6 sm:h-7">
      <h2 className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-400 to-pink-500 font-semibold">
        {displayText}
        <span className="ml-0.5 w-0.5 h-5 bg-gradient-to-b from-sky-400 via-amber-400 to-pink-500 animate-blink" />
      </h2>
    </div>
  )
}
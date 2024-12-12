"use client";
import { useEffect, useState, useCallback, useMemo } from 'react'

interface Props {
  texts?: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

export default function LandingTypeWrite({
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

  // 使用 useMemo 缓存当前要显示的文本，明确返回类型为 string
  const currentText = useMemo((): string => {
    if (!texts.length) return ''
    return texts[currentIndex % texts.length]!
  }, [texts, currentIndex])

  // 使用 useCallback 缓存状态更新函数
  const handleTyping = useCallback(() => {
    // currentText 已经确保是 string 类型，不会是 undefined
    if (displayText.length < currentText.length) {
      setDisplayText(currentText.slice(0, displayText.length + 1))
      return true
    }
    return false
  }, [currentText, displayText])

  const handleDeleting = useCallback(() => {
    if (displayText.length > 0) {
      setDisplayText(prev => prev.slice(0, -1))
      return true
    }
    return false
  }, [displayText.length])

  const moveToNextText = useCallback(() => {
    setIsTyping(true)
    setCurrentIndex(prev => (prev + 1) % texts.length)
  }, [texts.length])

  useEffect(() => {
    if (!currentText) return

    let timeoutId: NodeJS.Timeout

    const updateText = () => {
      if (isTyping) {
        const shouldContinue = handleTyping()
        if (shouldContinue) {
          timeoutId = setTimeout(updateText, typingSpeed)
        } else {
          timeoutId = setTimeout(() => {
            setIsTyping(false)
            updateText()
          }, pauseTime)
        }
      } else {
        const shouldContinue = handleDeleting()
        if (shouldContinue) {
          timeoutId = setTimeout(updateText, deletingSpeed)
        } else {
          moveToNextText()
        }
      }
    }

    timeoutId = setTimeout(updateText, isTyping ? typingSpeed : deletingSpeed)

    return () => clearTimeout(timeoutId)
  }, [
    currentText,
    isTyping,
    handleTyping,
    handleDeleting,
    moveToNextText,
    typingSpeed,
    deletingSpeed,
    pauseTime
  ])

  return (
    <div className="h-6 sm:h-7">
      <h2 className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-400 to-pink-500 font-semibold">
        {displayText}
        <span className="ml-0.5 w-0.5 h-5 bg-gradient-to-b from-sky-400 via-amber-400 to-pink-500 animate-blink" />
      </h2>
    </div>
  )
}
'use client'

import { cn } from '@/utils'
import { ArrowUpToLine, MoveUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 rounded-full right-8 z-50 bg-violet-500 hover:bg-violet-600 shadow-lg transition-all duration-300 ease-in-out",
            "hover:scale-110 p-2 text-white",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none cursor-default",
          )}
          aria-label="回到顶部"
        >
          <ArrowUpToLine className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </>
  )
}
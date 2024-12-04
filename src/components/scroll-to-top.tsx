'use client'

import { MoveUp } from 'lucide-react'
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
          className="fixed right-4 bottom-4 sm:right-8 sm:bottom-8 p-2.5 
            bg-white/90 hover:bg-white 
            backdrop-blur-[2px]
            rounded-full
            shadow-sm hover:shadow
            border border-purple-100/30
            transition-all duration-300 
            group
            z-50"
          aria-label="回到顶部"
        >
          <MoveUp className="w-5 h-5 text-purple-500/70 group-hover:text-purple-600 transition-colors"/>
        </button>
      )}
    </>
  )
}
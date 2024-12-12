import { memo, ReactNode } from "react"

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

const EmojiSectionTitle = memo(function EmojiSectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`relative mb-12 ${className}`}>
      <div className="flex items-center justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 relative px-8">
          <span className="relative inline-block">
            {children}
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </span>
        </h2>
      </div>
    </div>
  )
})

EmojiSectionTitle.displayName = 'EmojiSectionTitle'

export default EmojiSectionTitle 
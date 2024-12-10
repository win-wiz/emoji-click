export default function EmojiShadow() {
  {/* 底部装饰 */}
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="h-32 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
    </div>
  )
}
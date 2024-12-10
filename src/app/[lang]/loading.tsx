export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {/* 旋转的表情容器 */}
      <div className="relative">
        {/* 主要表情 */}
        <div className="text-7xl animate-bounce-slow">
          😊
        </div>
        
        {/* 环绕的表情 */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          {['🙂', '😄', '😃', '😀'].map((emoji, index) => (
            <div
              key={index}
              className="absolute text-3xl animate-pulse-slow"
              style={{
                animation: `pulse-slow 2s ease-in-out ${index * 0.5}s infinite`,
                transform: `rotate(${index * 90}deg) translateY(-4rem)`,
                opacity: 0.3,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Loading 文字 */}
      <div className="mt-8 flex items-center gap-2">
        <div className="relative h-4">
          <div className="absolute top-0 mt-1 w-24 h-0.5 bg-primary/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary animate-[loading_1s_ease-in-out_infinite]" />
          </div>
        </div>
        <span className="text-primary/70 animate-pulse mt-10 text-center">Loading...</span>
      </div>
    </div>
  );
}

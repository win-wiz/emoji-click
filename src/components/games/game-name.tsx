import { type ReactNode } from "react";

export const runtime = 'edge';

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full flex flex-col items-center justify-center",
    titleWrapper: "relative flex flex-col items-center",
    titleContainer: "relative group px-10 py-3",
    title: "text-4xl font-bold bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400 bg-clip-text text-transparent relative z-10 animate-gradient-x",
    background: "absolute inset-0 bg-gradient-to-r from-purple-50/50 via-white/80 to-violet-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 shadow-sm group-hover:shadow-md",
    decoration: {
      bottom: "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-violet-300 to-transparent group-hover:w-32 transition-all duration-300 delay-100"
    }
  },
  icon: {
    left: "absolute top-1/2 -translate-y-1/2 -left-8 text-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125",
    right: "absolute top-1/2 -translate-y-1/2 -right-8 text-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125"
  }
} as const;

// 装饰性图标组件 - 纯展示
function DecorationIcon({ position, emoji }: { position: 'left' | 'right'; emoji: string }) {
  return (
    <span className={STYLES.icon[position]}>
      {emoji}
    </span>
  );
}

// 标题内容组件 - 纯展示
function TitleContent({ children }: { children: ReactNode }) {
  return (
    <div className={STYLES.container.titleContainer}>
      <div className={STYLES.container.background} />
      <DecorationIcon position="left" emoji="🎮" />
      <DecorationIcon position="right" emoji="🎯" />
      <h1 className={STYLES.container.title}>{children}</h1>
      <div className={STYLES.container.decoration.bottom} />
    </div>
  );
}

// 主组件
export function GameName({ name }: { name: string }) {
  if (!name?.trim()) return null;

  return (
    <div className={STYLES.container.wrapper}>
      <div className={STYLES.container.titleWrapper}>
        <TitleContent>{name.trim()}</TitleContent>
      </div>
    </div>
  );
}

export default GameName;
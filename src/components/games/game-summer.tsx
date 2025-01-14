import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8 space-y-4"
  },
  item: {
    wrapper: "relative bg-white rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg",
    decorator: "absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-100 group-hover:bg-yellow-400 transition-colors duration-300",
    content: {
      wrapper: "flex items-start p-6",
      index: "flex-shrink-0 w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-sm font-medium mr-4",
      text: "flex-1 text-gray-600 text-sm leading-relaxed"
    }
  }
} as const;

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

// 段落项组件 - 纯展示
function ParagraphItem({ content, index }: { content: string; index: number }) {
  return (
    <div className={STYLES.item.wrapper}>
      <div className={STYLES.item.decorator} />
      <div className={STYLES.item.content.wrapper}>
        <p className={STYLES.item.content.text}>
          {content}
        </p>
      </div>
    </div>
  );
}

// 内容容器组件 - 纯展示
function ContentContainer({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <div className={STYLES.container.content}>
      {items.map((content, index) => (
        <ParagraphItem 
          key={`paragraph-${index}`} 
          content={content} 
          index={index} 
        />
      ))}
    </div>
  );
}

// 主组件
export function GameSummer({ gameSummer }: { gameSummer: string }) {
  if (!gameSummer) {
    return null;
  }

  const items = gameSummer.split('\n').filter(Boolean);

  if (!items.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title={{ id: "game.summer.title", message: "游戏总结" }}
        description={{ id: "game.summer.description", message: "查看您的游戏表现" }}
        iconBgColor="bg-yellow-50"
        iconColor="text-yellow-600"
      />
      <ContentContainer items={items} />
    </div>
  );
}

export default GameSummer;
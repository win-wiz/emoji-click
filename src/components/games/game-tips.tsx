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
    decorator: "absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-100 group-hover:bg-indigo-400 transition-colors duration-300",
    content: {
      wrapper: "flex items-start p-6",
      index: "flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-medium mr-4",
      text: "flex-1 text-gray-600 text-sm leading-relaxed"
    }
  }
} as const;

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// 提示项组件 - 纯展示
function TipItem({ content, index }: { content: string; index: number }) {
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
function ContentContainer({ tips }: { tips: string[] }) {
  if (!tips.length) return null;

  return (
    <div className={STYLES.container.content}>
      {tips.map((tip, index) => (
        <TipItem 
          key={`tip-${index}`} 
          content={tip} 
          index={index} 
        />
      ))}
    </div>
  );
}

// 主组件
export function GameTips({ starting }: { starting: string }) {
  if (!starting) {
    return null;
  }

  const tips = starting.split('\n').filter(Boolean);

  if (!tips.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title='game.tips.title'
        description='game.tips.description'
        iconBgColor="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <ContentContainer tips={tips} />
    </div>
  );
}

export default GameTips;
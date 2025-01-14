import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "space-y-4"
  },
  item: {
    wrapper: "relative bg-white rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg",
    decorator: "absolute left-0 top-0 bottom-0 w-[3px] bg-blue-100 group-hover:bg-blue-400 transition-colors duration-300",
    content: {
      wrapper: "flex items-start p-6",
      index: "flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium mr-4",
      text: "flex-1 text-gray-600 text-sm leading-relaxed"
    }
  }
} as const;

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// 段落项组件 - 纯展示
function ParagraphItem({ content, index }: { content: string; index: number }) {
  return (
    <div className={STYLES.item.wrapper}>
      <div className={STYLES.item.decorator} />
      <div className={STYLES.item.content.wrapper}>
        <div className={STYLES.item.content.index}>
          {index + 1}
        </div>
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

// 数据处理函数
function parseDescription(description: string): string[] {
  if (!description) return [];
  
  try {
    return description.split('\n').filter(Boolean);
  } catch (error) {
    console.error('解析失败:', error);
    return [];
  }
}

// 主组件
export function GameDescription({ detailDesc }: { detailDesc: string }) {
  const items = parseDescription(detailDesc);

  if (!items.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title='game.description.title'
        description='game.description.description'
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <ContentContainer items={items} />
    </div>
  );
}

export default GameDescription;
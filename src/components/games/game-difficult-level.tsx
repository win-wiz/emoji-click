import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface Level {
  contentKey: string;
  contentValue: string;
}

// 静态资源缓存
const HEADER_ICON = (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M13 10V3L4 14h7v7l9-11h-7z" 
    />
  </svg>
);

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8"
  },
  grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
  card: {
    base: "group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-md",
    decorator: "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-50 blur-xl pointer-events-none",
    indicator: "absolute left-0 bottom-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl",
    content: {
      wrapper: "relative",
      title: "text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors mb-3",
      description: "text-base text-gray-600 leading-relaxed"
    }
  }
} as const;

// 颜色配置
const LEVEL_COLORS = [
  { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', hover: 'hover:border-green-200', decorator: 'bg-green-100' },
  { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', hover: 'hover:border-blue-200', decorator: 'bg-blue-100' },
  { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', hover: 'hover:border-purple-200', decorator: 'bg-purple-100' },
  { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', hover: 'hover:border-orange-200', decorator: 'bg-orange-100' }
] as const;

// 装饰组件 - 纯展示
function DecorativeCircle({ color }: { color: typeof LEVEL_COLORS[number] }) {
  return (
    <div className={`${STYLES.card.decorator} ${color.decorator}`} />
  );
}

// 底部指示器组件 - 纯展示
function BottomIndicator({ color }: { color: typeof LEVEL_COLORS[number] }) {
  return (
    <div className={`${STYLES.card.indicator} ${color.text}`} />
  );
}

// 卡片内容组件 - 纯展示
function LevelContent({ level }: { level: Level }) {
  return (
    <div className={STYLES.card.content.wrapper}>
      <h4 className={STYLES.card.content.title}>{level.contentKey}</h4>
      <p className={STYLES.card.content.description}>{level.contentValue}</p>
    </div>
  );
}

const LEVEL_STYLES: Record<string, any> = {
  '0': {
    wrapper: "bg-green-50/80 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-green-100/50",
    title: "text-lg font-semibold text-green-800",
    description: "text-green-700 mt-2 leading-relaxed"
  },
  '1': {
    wrapper: "bg-blue-50/80 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-blue-100/50",
    title: "text-lg font-semibold text-blue-800",
    description: "text-blue-700 mt-2 leading-relaxed"
  },
  '2': {
    wrapper: "bg-purple-50/80 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-purple-100/50",
    title: "text-lg font-semibold text-purple-800",
    description: "text-purple-700 mt-2 leading-relaxed"
  },
  '3': {
    wrapper: "bg-orange-50/80 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-orange-100/50",
    title: "text-lg font-semibold text-orange-800",
    description: "text-orange-700 mt-2 leading-relaxed"
  }
} as const;

function LevelCard({ level, description, index }: { level: string; description: string; index: number }) {
  const styles = LEVEL_STYLES[index];
  
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>{level}</h4>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

// 难度列表组件 - 纯展示
function LevelGrid({ levels }: { levels: Level[] }) {
  if (!levels.length) return null;

  // const levelKeys: (keyof typeof LEVEL_STYLES)[] = ['beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {levels.map((level, index) => (
        <LevelCard
          key={`level-${index}`}
          level={level.contentKey}
          description={level.contentValue}
          index={index}
        />
      ))}
    </div>
  );
}

// 数据处理函数
function parseLevels(levelDesc: string): Level[] {
  try {
    return JSON.parse(levelDesc) as Level[];
  } catch (error) {
    console.error('Failed to parse levelDesc:', error);
    return [];
  }
}

// 主组件
export function GameDifficultLevel({ levelDesc }: { levelDesc: string }) {
  const levels = parseLevels(levelDesc);

  // console.log(levels);

  if (!levels.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title='game.difficulty.title'
        description='game.difficulty.description'
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <div className={STYLES.container.content}>
        <LevelGrid levels={levels} />
      </div>
    </div>
  );
}

export default GameDifficultLevel;
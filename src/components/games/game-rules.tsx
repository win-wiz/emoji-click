import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface RuleItem {
  contentKey: string;
  contentValue: string;
}

interface Rule {
  title: string;
  content: string;
  icon: string;
  type: 'basic' | 'success' | 'failure' | 'complete' | 'timer';
}

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
  },
  card: {
    wrapper: "group relative",
    content: "bg-white/80 backdrop-blur-sm rounded-2xl p-6 border hover:shadow-lg transition-all duration-300",
    inner: "flex items-center space-x-4"
  },
  icon: {
    container: {
      wrapper: "relative",
      blur: "absolute inset-0 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity",
      content: "relative w-14 h-14 flex items-center justify-center rounded-xl group-hover:scale-105 transition-transform"
    },
    svg: "h-7 w-7"
  },
  text: {
    wrapper: "flex-1 pt-1.5",
    title: "text-lg font-bold mb-3 transition-colors",
    description: "text-gray-600 text-sm leading-relaxed"
  }
} as const;

// 图标配置 - 使用 Record 代替 Map 以提高性能
const ICONS: Record<string, JSX.Element> = {
  cards: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
  success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  failure: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  level: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  timer: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
};

// 样式配置 - 使用 Record 代替 Map 以提高性能
const TYPE_STYLES: Record<Rule['type'], {
  bg: string;
  text: string;
  hover: string;
  gradient: string;
  border: string;
}> = {
  basic: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hover: 'group-hover:text-blue-700',
    gradient: 'from-blue-400 to-indigo-400',
    border: 'border-blue-100/30'
  },
  success: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    hover: 'group-hover:text-green-700',
    gradient: 'from-green-400 to-emerald-400',
    border: 'border-green-100/30'
  },
  failure: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    hover: 'group-hover:text-red-700',
    gradient: 'from-red-400 to-rose-400',
    border: 'border-red-100/30'
  },
  complete: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hover: 'group-hover:text-purple-700',
    gradient: 'from-purple-400 to-pink-400',
    border: 'border-purple-100/30'
  },
  timer: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    hover: 'group-hover:text-amber-700',
    gradient: 'from-amber-400 to-yellow-400',
    border: 'border-amber-100/30'
  }
};

// 类型映射配置 - 使用 Record 代替 Map 以提高性能
type RuleType = {
  type: 'basic' | 'success' | 'failure' | 'complete' | 'timer';
  icon: 'cards' | 'success' | 'failure' | 'level' | 'timer';
};

const TYPE_MAP: { [key: number]: RuleType } = {
  0: { type: 'basic', icon: 'cards' },
  1: { type: 'success', icon: 'success' },
  2: { type: 'failure', icon: 'failure' },
  3: { type: 'complete', icon: 'level' },
  4: { type: 'timer', icon: 'timer' }
};

// 图标组件 - 纯展示
function RuleIcon({ icon }: { icon: keyof typeof ICONS }) {
  const iconPath = ICONS[icon];
  if (!iconPath) return null;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={STYLES.icon.svg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {iconPath}
    </svg>
  );
}

// 规则内容组件 - 纯展示
function RuleContent({ title, content, styles }: { 
  title: string; 
  content: string; 
  styles: { text: string; hover: string; }
}) {
  return (
    <div className={STYLES.text.wrapper}>
      <h4 className={`${STYLES.text.title} ${styles.text} ${styles.hover}`}>
        {title}
      </h4>
      <p className={STYLES.text.description}>
        {content}
      </p>
    </div>
  );
}

// 规则图标容器组件 - 纯展示
function RuleIconContainer({ icon, styles }: { 
  icon: keyof typeof ICONS; 
  styles: { bg: string; text: string; gradient: string; }
}) {
  return (
    <div className={STYLES.icon.container.wrapper}>
      <div className={`${STYLES.icon.container.blur} bg-gradient-to-br ${styles.gradient}`} />
      <div className={`${STYLES.icon.container.content} ${styles.bg} ${styles.text}`}>
        <RuleIcon icon={icon} />
      </div>
    </div>
  );
}

// 规则卡片组件 - 纯展示
function RuleCard({ rule }: { rule: Rule }) {
  const styles = TYPE_STYLES[rule.type];
  if (!styles) return null;

  return (
    <div className={STYLES.card.wrapper}>
      <div className={`${STYLES.card.content} ${styles.border}`}>
        <div className={STYLES.card.inner}>
          <RuleIconContainer icon={rule.icon as keyof typeof ICONS} styles={styles} />
          <RuleContent title={rule.title} content={rule.content} styles={styles} />
        </div>
      </div>
    </div>
  );
}

// 数据处理函数
function parseGameRules(gameRules: string): Rule[] {
  try {
    const ruleItems: RuleItem[] = JSON.parse(gameRules);
    return ruleItems.map((item, index) => {
      const typeInfo = TYPE_MAP[index] || TYPE_MAP[0]!;
      return {
        title: item.contentKey,
        content: item.contentValue,
        icon: typeInfo.icon,
        type: typeInfo.type
      };
    });
  } catch (error) {
    console.error('Failed to parse game rules:', error);
    return [];
  }
}

// 主组件
export function GameRules({ gameRules }: { gameRules: string }) {
  const rules = parseGameRules(gameRules);

  if (!rules.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title={{ id: "game.rules.title", message: "游戏规则" }}
        description={{ id: "game.rules.description", message: "掌握这些规则开始游戏" }}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <div className={STYLES.container.content}>
        {rules.map((rule, index) => (
          <RuleCard key={`rule-${index}`} rule={rule} />
        ))}
      </div>
    </div>
  );
}

export default GameRules;
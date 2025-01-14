import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface Tip {
  contentKey: string;
  contentValue: string;
}

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
  },
  tip: {
    wrapper: "bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-amber-100/50",
    content: "flex items-start space-x-4",
    icon: {
      wrapper: "flex-shrink-0 w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-xl",
      svg: "w-6 h-6"
    },
    text: {
      wrapper: "flex-1",
      title: "text-lg font-semibold text-gray-900",
      description: "text-gray-600 mt-2 leading-relaxed"
    }
  }
} as const;

// 图标配置
const TIP_ICONS = [
  <path key="tip-icon-1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  <path key="tip-icon-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  <path key="tip-icon-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />,
  <path key="tip-icon-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  <path key="tip-icon-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
];

// 图标组件 - 纯展示
function TipIcon({ index }: { index: number }) {
  const iconPath = TIP_ICONS[index % TIP_ICONS.length];
  return (
    <div className={STYLES.tip.icon.wrapper}>
      <svg xmlns="http://www.w3.org/2000/svg" className={STYLES.tip.icon.svg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {iconPath}
      </svg>
    </div>
  );
}

// 文本内容组件 - 纯展示
function TipContent({ tip }: { tip: Tip }) {
  return (
    <div className={STYLES.tip.text.wrapper}>
      <h4 className={STYLES.tip.text.title}>{tip.contentKey}</h4>
      <p className={STYLES.tip.text.description}>{tip.contentValue}</p>
    </div>
  );
}

// 单个提示卡片组件 - 纯展示
function TipCard({ tip, index }: { tip: Tip; index: number }) {
  return (
    <div className={STYLES.tip.wrapper}>
      <div className={STYLES.tip.content}>
        <TipIcon index={index} />
        <TipContent tip={tip} />
      </div>
    </div>
  );
}

// 提示网格组件 - 纯展示
function TipsGrid({ tips }: { tips: Tip[] }) {
  if (!tips.length) return null;

  return (
    <div className={STYLES.container.content}>
      {tips.map((tip, index) => (
        <TipCard key={`tip-${index}`} tip={tip} index={index} />
      ))}
    </div>
  );
}

// 数据处理函数
function parseTips(tipsJson: string): Tip[] {
  try {
    return JSON.parse(tipsJson) as Tip[];
  } catch (error) {
    console.error('Failed to parse tips:', error);
    return [];
  }
}

// 主组件
export function GameAdvanceTips({ advanceTips }: { advanceTips: string }) {
  const tipsList = parseTips(advanceTips);

  if (!tipsList.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title={{ id: "game.tips.advanced.title", message: "高级技巧" }}
        description={{ id: "game.tips.advanced.description", message: "掌握这些技巧提升游戏水平" }}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
      />
      <TipsGrid tips={tipsList} />
    </div>
  );
}

export default GameAdvanceTips;
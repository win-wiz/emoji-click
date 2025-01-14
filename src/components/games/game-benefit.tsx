import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface Benefit {
  contentKey: string;
  contentValue: string;
}

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
  },
  card: {
    wrapper: "bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-green-100/50",
    content: {
      wrapper: "flex items-start space-x-4",
      icon: {
        wrapper: "flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-xl",
        text: "text-xl font-bold"
      },
      text: {
        wrapper: "flex-1",
        title: "text-lg font-semibold text-gray-900 mb-2",
        description: "text-gray-600 text-sm leading-relaxed"
      }
    }
  }
} as const;

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// 序号图标组件 - 纯展示
function BenefitIndex({ index }: { index: number }) {
  return (
    <div className={STYLES.card.content.icon.wrapper}>
      <span className={STYLES.card.content.icon.text}>
        {index + 1}
      </span>
    </div>
  );
}

// 内容组件 - 纯展示
function BenefitContent({ benefit }: { benefit: Benefit }) {
  return (
    <div className={STYLES.card.content.text.wrapper}>
      <h4 className={STYLES.card.content.text.title}>
        {benefit.contentKey}
      </h4>
      <p className={STYLES.card.content.text.description}>
        {benefit.contentValue}
      </p>
    </div>
  );
}

// 卡片组件 - 纯展示
function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  return (
    <div className={STYLES.card.wrapper}>
      <div className={STYLES.card.content.wrapper}>
        <BenefitIndex index={index} />
        <BenefitContent benefit={benefit} />
      </div>
    </div>
  );
}

// 卡片列表组件 - 纯展示
function BenefitsGrid({ benefits }: { benefits: Benefit[] }) {
  if (!benefits.length) return null;

  return (
    <div className={STYLES.container.content}>
      {benefits.map((benefit, index) => (
        <BenefitCard 
          key={`benefit-${index}`} 
          benefit={benefit} 
          index={index} 
        />
      ))}
    </div>
  );
}

// 数据处理函数
function parseBenefits(benefitsJson: string): Benefit[] {
  if (!benefitsJson) return [];

  try {
    const items = JSON.parse(benefitsJson);
    if (!Array.isArray(items) || !items.length) return [];
    
    // 验证数组中的每个项目是否符合 Benefit 接口
    return items.filter((item): item is Benefit => 
      typeof item === 'object' &&
      item !== null &&
      typeof item.contentKey === 'string' &&
      typeof item.contentValue === 'string'
    );
  } catch (error) {
    console.error('Failed to parse benefits:', error);
    return [];
  }
}

// 主组件
export function GameBenefit({ benefits }: { benefits: string }) {
  const benefitsList = parseBenefits(benefits);

  if (!benefitsList.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title='game.benefits.title'
        description='game.benefits.description'
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
      <BenefitsGrid benefits={benefitsList} />
    </div>
  );
}

export default GameBenefit;
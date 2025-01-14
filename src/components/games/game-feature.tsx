import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface Feature {
  contentKey: string;
  contentValue: string;
}

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  },
  card: {
    wrapper: "group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100",
    content: {
      wrapper: "flex items-center space-x-3 mb-4",
      icon: {
        wrapper: "w-10 h-10 flex items-center justify-center bg-violet-100 text-violet-600 rounded-lg group-hover:scale-110 transition-transform duration-300"
      },
      title: "text-lg font-semibold text-gray-900",
      description: "text-gray-600 leading-relaxed"
    }
  }
} as const;

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// 图标映射
const FEATURE_ICONS = {
  0: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />,
  1: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  2: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />,
  3: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  4: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
} as const;

// 特性图标组件
function FeatureIcon({ position }: { position: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {FEATURE_ICONS[position as keyof typeof FEATURE_ICONS] || FEATURE_ICONS[0]}
    </svg>
  );
}

// 特性内容组件
function FeatureContent({ feature, position }: { feature: Feature; position: number }) {
  return (
    <>
      <div className={STYLES.card.content.wrapper}>
        <span className={STYLES.card.content.icon.wrapper}>
          <FeatureIcon position={position} />
        </span>
        <h4 className={STYLES.card.content.title}>{feature.contentKey}</h4>
      </div>
      <p className={STYLES.card.content.description}>{feature.contentValue}</p>
    </>
  );
}

// 特性卡片组件
function FeatureCard({ feature, position }: { feature: Feature; position: number }) {
  return (
    <div className={STYLES.card.wrapper}>
      <FeatureContent feature={feature} position={position} />
    </div>
  );
}

// 特性网格组件
function FeatureGrid({ features }: { features: Feature[] }) {
  if (!features.length) return null;

  return (
    <div className={STYLES.container.grid}>
      {features.map((feature, index) => (
        <FeatureCard 
          key={`feature-${index}`} 
          feature={feature} 
          position={index} 
        />
      ))}
    </div>
  );
}

// 数据处理函数
function parseFeatures(featuresJson: string): Feature[] {
  if (!featuresJson) return [];

  try {
    const items = JSON.parse(featuresJson);
    if (!Array.isArray(items) || !items.length) return [];
    
    // 验证数组中的每个项目是否符合 Feature 接口
    return items.filter((item): item is Feature => 
      typeof item === 'object' &&
      item !== null &&
      typeof item.contentKey === 'string' &&
      typeof item.contentValue === 'string'
    );
  } catch (error) {
    console.error('Failed to parse features:', error);
    return [];
  }
}

// 主组件
export function GameFeature({ features }: { features: string }) {
  const featureList = parseFeatures(features);

  if (!featureList.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title='game.features.title'
        description='game.features.description'
        iconBgColor="bg-violet-50"
        iconColor="text-violet-600"
      />
      <div className={STYLES.container.content}>
        <FeatureGrid features={featureList} />
      </div>
    </div>
  );
}

export default GameFeature;
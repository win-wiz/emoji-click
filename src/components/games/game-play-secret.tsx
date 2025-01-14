import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface Secret {
  contentKey: string;
  contentValue: string;
}

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-8"
  },
  card: {
    wrapper: "group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden",
    content: {
      wrapper: "relative z-10",
      title: "text-lg font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors",
      text: "text-gray-600 leading-relaxed"
    },
    decorator: {
      wrapper: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
      top: "absolute right-0 top-0 w-32 h-32 bg-pink-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl",
      bottom: "absolute left-0 bottom-0 w-24 h-24 bg-purple-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl",
      border: "absolute inset-0 border-2 border-pink-200 opacity-0 transition-opacity rounded-2xl"
    }
  }
} as const;

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// 装饰背景组件 - 纯展示
function DecorativeBg() {
  return (
    <div className={STYLES.card.decorator.wrapper}>
      <div className={STYLES.card.decorator.top} />
      <div className={STYLES.card.decorator.bottom} />
    </div>
  );
}

// 秘诀内容组件 - 纯展示
function SecretContent({ secret }: { secret: Secret }) {
  return (
    <div className={STYLES.card.content.wrapper}>
      <h4 className={STYLES.card.content.title}>
        {secret.contentKey}
      </h4>
      <p className={STYLES.card.content.text}>
        {secret.contentValue}
      </p>
    </div>
  );
}

// 秘诀卡片组件 - 纯展示
function SecretCard({ secret }: { secret: Secret }) {
  return (
    <div className={STYLES.card.wrapper}>
      <DecorativeBg />
      <SecretContent secret={secret} />
      <div className={STYLES.card.decorator.border} />
    </div>
  );
}

// 秘诀网格组件 - 纯展示
function SecretGrid({ secrets }: { secrets: Secret[] }) {
  if (!secrets.length) return null;

  return (
    <div className={STYLES.container.grid}>
      {secrets.map((secret, index) => (
        <SecretCard key={`secret-${index}`} secret={secret} />
      ))}
    </div>
  );
}

// 数据处理函数
function parseSecrets(secretsJson: string): Secret[] {
  if (!secretsJson) return [];

  try {
    const items = JSON.parse(secretsJson);
    if (!Array.isArray(items) || !items.length) return [];
    
    // 验证数组中的每个项目是否符合 Secret 接口
    return items.filter((item): item is Secret => 
      typeof item === 'object' &&
      item !== null &&
      typeof item.contentKey === 'string' &&
      typeof item.contentValue === 'string'
    );
  } catch (error) {
    console.error('Failed to parse secrets:', error);
    return [];
  }
}

// 主组件
export function GamePlaySecret({ gameSecret }: { gameSecret: string }) {
  const secrets = parseSecrets(gameSecret);

  if (!secrets.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title={{ id: "game.secret.title", message: "游戏秘诀" }}
        description={{ id: "game.secret.description", message: "掌握这些秘诀提升游戏体验" }}
        iconBgColor="bg-pink-100"
        iconColor="text-pink-600"
      />
      <div className={STYLES.container.content}>
        <SecretGrid secrets={secrets} />
      </div>
    </div>
  );
}

export default GamePlaySecret;
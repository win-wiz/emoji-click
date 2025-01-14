import SectionHeader from "@/components/common/section-header";

export const runtime = 'edge';

// 类型定义
interface FAQ {
  contentKey: string;
  contentValue: string;
}

// 静态资源缓存
const HEADER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full",
    content: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
  },
  faq: {
    wrapper: "bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-purple-100/50",
    content: {
      wrapper: "flex items-start space-x-4",
      icon: {
        wrapper: "flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-600 rounded-xl",
        text: "text-xl font-bold"
      },
      text: {
        wrapper: "flex-1",
        question: "text-lg font-semibold text-gray-900 mb-2",
        answer: "text-gray-600 text-sm leading-relaxed"
      }
    }
  }
} as const;

// 问题图标组件 - 纯展示
function QuestionIcon() {
  return (
    <div className={STYLES.faq.content.icon.wrapper}>
      <span className={STYLES.faq.content.icon.text}>Q</span>
    </div>
  );
}

// FAQ内容组件 - 纯展示
function FAQContent({ faq }: { faq: FAQ }) {
  return (
    <div className={STYLES.faq.content.text.wrapper}>
      <h4 className={STYLES.faq.content.text.question}>
        {faq.contentKey}
      </h4>
      <p className={STYLES.faq.content.text.answer}>
        {faq.contentValue}
      </p>
    </div>
  );
}

// FAQ卡片组件 - 纯展示
function FAQCard({ faq }: { faq: FAQ }) {
  return (
    <div className={STYLES.faq.wrapper}>
      <div className={STYLES.faq.content.wrapper}>
        <QuestionIcon />
        <FAQContent faq={faq} />
      </div>
    </div>
  );
}

// FAQ列表组件 - 纯展示
function FAQList({ faqs }: { faqs: FAQ[] }) {
  if (!faqs.length) return null;

  return (
    <div className={STYLES.container.content}>
      {faqs.map((faq, index) => (
        <FAQCard key={`faq-${index}`} faq={faq} />
      ))}
    </div>
  );
}

// 数据处理函数
function parseFAQs(faqsJson: string): FAQ[] {
  if (!faqsJson) return [];

  try {
    return JSON.parse(faqsJson) as FAQ[];
  } catch (error) {
    console.error('Failed to parse FAQs:', error);
    return [];
  }
}

// 主组件
export function GameFAQ({ faqs }: { faqs: string }) {
  const faqList = parseFAQs(faqs);

  if (!faqList.length) {
    return null;
  }

  return (
    <div className={STYLES.container.wrapper}>
      <SectionHeader
        icon={HEADER_ICON}
        title='game.faq.title'
        description='game.faq.description'
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <FAQList faqs={faqList} />
    </div>
  );
}

export default GameFAQ;
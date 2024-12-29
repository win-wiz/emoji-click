'use client';

import { t, Trans } from "@lingui/macro";
import { memo, Fragment } from "react";

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WorkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const HowToIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const AnywhereIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FreeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LanguageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
);

const UpdateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const questions = [
  {
    title: <Trans>什么是EmojiClick？</Trans>,
    content: <Trans>EmojiClick是一款**AI驱动的emoji搜索工具**。它通过理解你的自然语言，帮你快速找到最贴切的emoji——无需记住emoji名字，也无需翻遍表情库。  </Trans>,
    icon: <QuestionIcon />,
  },
  {
    title: <Trans>EmojiClick的AI表情搜索是如何工作的？</Trans>,
    content: <Trans>EmojiClick利用先进的AI技术分析你的输入——无论是情绪、短语，还是一句歌词——并从数据库中匹配最相关的emoji。你可以把它看作你的emoji翻译官</Trans>,
    icon: <WorkIcon />,
  },
  {
    title: <Trans>如何使用EmojiClick？</Trans>,
    content: (
      <ol className="list-decimal list-inside leading-snug">
        <li><Trans>输入你想表达的内容（比如“我好累”或“感觉自己像个明星”）。</Trans></li>
        <li><Trans>EmojiClick的AI emoji搜索会立即推荐最合适的emoji。</Trans></li>
        <li><Trans>点击复制，然后随意使用！</Trans></li>
      </ol>
    ),
    icon: <HowToIcon />,
  },
  {
    title: <Trans>我可以在任何地方使用这些表情吗？</Trans>,
    content: <Trans>当然可以！找到emoji后，你可以将它复制粘贴到任何应用、平台或消息中——无论是聊天、社交媒体还是邮件。</Trans>,
    icon: <AnywhereIcon />,
  },
  {
    title: <Trans>这项服务是免费的吗？</Trans>,
    content: <Trans>是的，EmojiClick完全免费使用！没有隐藏费用，也没有订阅——让emoji搜索变得简单。</Trans>,
    icon: <FreeIcon />,
  },
  {
    title: <Trans>EmojiClick支持多种语言吗？</Trans>,
    content: <Trans>目前，EmojiClick对中文的支持最为友好，但我们正在努力添加更多语言。敬请期待更新！</Trans>,
    icon: <LanguageIcon />,
  },
  {
    title: <Trans>表情数据库多久更新一次？</Trans>,
    content: <Trans>我们的AI emoji搜索工具会定期更新数据库，以包含最新的emoji和流行趋势。你总能找到最新鲜的表情选项。</Trans>,
    icon: <UpdateIcon />,
  },
];

const FAQ = memo(() => {
  return (
    <div className="bg-violet-50/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
          {t`常见问题解答`}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t`我们整理了一些常见问题,希望能够帮助你更好地使用EmojiClick。如果你有其他疑问,欢迎随时联系我们!`}
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question, index) => (
            <Fragment key={`faq-${index}`}>
              <div className="bg-white rounded-xl p-5 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="flex flex-shrink-0 items-center justify-center w-6 h-6 rounded-full bg-violet-500 text-violet-100 text-sm mr-2">
                    {question.icon}
                  </span>
                  <h2 className="text-base font-semibold tracking-tight text-gray-900 hover:text-violet-600 transition-colors">
                    {question.title}
                  </h2>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {question.content}
                </div>
              </div>
            </Fragment>
          ))}
        </ul>
        <div className="mt-10 bg-violet-100 rounded-xl p-6 text-center">
          <p className="text-lg font-medium text-violet-800 mb-2">  
            {t`还有其他问题吗?`}
          </p>
          <p className="text-gray-700">
            {t`如果你没有找到想要的答案,欢迎通过邮件联系我们的客服团队。我们将尽快回复你的疑问!`}
          </p>
          <a href="mailto:support@emojis.click" className="mt-4 inline-block bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition-colors">
            {t`联系我们`}
          </a>
        </div>
      </div>
    </div>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
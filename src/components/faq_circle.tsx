import { memo } from "react";

const FAQ = () => {
  const questions = [
    {
      title: "什么是EmojiClick？",
      content: "EmojiClick是一款AI驱动的emoji搜索工具。它通过理解你的自然语言,帮你快速找到最贴切的emoji。",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "EmojiClick的AI表情搜索是如何工作的？",
      content: "EmojiClick利用先进的AI技术分析你的输入,并从数据库中匹配最相关的emoji。",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      title: "如何使用EmojiClick？",
      content: (
        <ol className="list-decimal list-inside leading-snug">
          <li>输入你想表达的内容。</li>
          <li>EmojiClick会推荐最合适的emoji。</li>
          <li>点击复制,然后随意使用！</li>
        </ol>
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    },
    {
      title: "我可以在任何地方使用这些表情吗？",
      content: "当然可以！找到emoji后,你可以将它复制粘贴到任何应用、平台或消息中。",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "这项服务是免费的吗？",
      content: "是的,EmojiClick完全免费使用！没有隐藏费用,也没有订阅。",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "EmojiClick支持多种语言吗？",
      content: "目前,EmojiClick对中文的支持最为友好,但我们正在努力添加更多语言。敬请期待更新！",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
    {
      title: "表情数据库多久更新一次？",
      content: "我们的AI emoji搜索工具会定期更新数据库,以包含最新的emoji和流行趋势。",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ];

  const radius = 30; // 圆的半径,单位为rem
  const offset = 4; // 问题块的偏移量,单位为rem
  const centerX = 50; // 圆心的x坐标,单位为%
  const centerY = 50; // 圆心的y坐标,单位为%

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative" style={{ height: `${radius * 2}rem` }}>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full px-6 py-3 shadow-md">
          常见问题解答
        </h1>
        <ul className="relative w-full h-full">
          {questions.map((question, index) => {
            const angle = (index / questions.length) * Math.PI * 2;
            const x = centerX + (radius + offset) * Math.cos(angle);
            const y = centerY + (radius + offset) * Math.sin(angle);
            return (
              <li
                key={question.title}
                className="bg-white rounded-xl shadow-md p-5 absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out hover:shadow-lg hover:z-20"
                style={{ left: `${x}%`, top: `${y}%`, width: '18vw' }}
              >
                <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 text-indigo-100 text-base mr-2">
                    {question.icon}
                  </span>
                  <h2 className="text-base font-semibold tracking-tight text-gray-900">{question.title}</h2>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{question.content}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

FAQ.displayName = 'FAQ';

export default FAQ;
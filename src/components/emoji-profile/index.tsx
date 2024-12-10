'use client';

import { useState } from "react";
import EmojiCode from "./emoji-code";

interface EmojiDetail {
  emojiData: Record<string, any>
}

export default function EmojiProfile({ emojiData = {} }: EmojiDetail) {
  const [copied, setCopied] = useState(false);
  console.log(emojiData)

  return (
    <div className="min-h-screen">
      
      <EmojiCode code={emojiData.code} name={emojiData.name} />
      {/* 主要内容区域 */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 基本含义 - 大号展示 */}
        <section className="mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-primary justify-center">
            <span className="text-4xl">📖</span> 基本含义
          </h2>
          <p className="text-2xl leading-relaxed">{emojiData.meaning}</p>
        </section>

        {/* 搜索关键词区域 - 创新布局 */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-primary justify-center">
            <span className="text-4xl">🔍</span> 搜索关键词
          </h2>
          <div className="relative">
            {/* 中心emoji */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10">
              {emojiData.emoji}
            </div>
            {/* 关键词网格 */}
            {/* <div className="grid grid-cols-2 gap-12 relative">
              {Object.entries(emojiData.keywords).map(([category, words]) => (
                <div key={category} 
                  className="backdrop-blur-sm bg-white/30 dark:bg-base-200/30 p-8 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-primary/80">
                    {category === 'daily' && <><span className="text-2xl">📝</span> 日常用语</>}
                    {category === 'emotion' && <><span className="text-2xl">💭</span> 情绪描述</>}
                    {category === 'scene' && <><span className="text-2xl">🎬</span> 场景用语</>}
                    {category === 'internet' && <><span className="text-2xl">🌐</span> 网络用语</>}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {words.map((word, index) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 transition-all hover:scale-110 cursor-pointer text-primary"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
          <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl">
            <div className="flex items-center gap-4 justify-center text-primary">
              <span className="text-2xl">💡</span>
              <p className="text-lg">搜索小贴士：可以使用这些关键词在各种平台上搜索这个表情符号</p>
            </div>
          </div>
        </section>

        {/* 使用场景和文化差异 */}
        <div className="mb-24 space-y-16">
          {/* 使用场景 */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-primary justify-center">
              <span className="text-4xl">🎯</span> 使用场景
            </h2>
            
            {/* 场景卡片网格 */}
            <div className="grid md:grid-cols-2 gap-8">
            
            </div>

            {/* 使用场景总结 */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
              <div className="flex flex-col items-center text-center gap-4">
                <span className="text-4xl">🎯</span>
                <h3 className="text-xl font-semibold text-primary">使用场景小贴士</h3>
                <p className="text-base-content/80 max-w-2xl">
                  这个表情符号在不同场景中都能传达友好和善意，关键是把握好使用的时机和频率，
                  让表情符号自然地融入对话中，增添交流的温度。
                </p>
              </div>
            </div>
          </section>

          {/* 文化差异 */}
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-primary justify-center">
              <span className="text-4xl">🌏</span> 文化差异
            </h2>
            <div className="max-w-3xl mx-auto">
             
            </div>
          </section>
        </div>

        {/* 相关推荐 - 环形布局 */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-primary justify-center">
            <span className="text-4xl">✨</span> 相关推荐
          </h2>
          <div className="relative h-48 max-w-2xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-10">{emojiData.emoji}</span>
            </div>
            <div className="relative flex justify-center items-center h-full">
              
            </div>
          </div>
        </section>

        {/* 使用技巧和历史演变 - 分开显示 */}
        <div className="space-y-24">
          {/* 使用��巧部分 */}
          <section>
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-primary justify-center">
              <span className="text-4xl">💡</span> 使用技巧
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              
            </div>
          </section>

          {/* 历史演变部分 */}
          <section>
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-primary justify-center">
              <span className="text-4xl">📜</span> 历史演变
            </h2>
            
            {/* 起源说明 */}
            <div className="max-w-3xl mx-auto mb-12 text-center">
              <div className="card bg-base-100/50 backdrop-blur-sm p-8">
                <p className="text-lg leading-relaxed">{}</p>
              </div>
            </div>

            {/* 时间线 */}
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8 relative">
                {/* 中轴线 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                

              </div>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
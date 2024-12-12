import { Trans } from "@lingui/macro";
import { memo } from "react";

// 定义功能标签数据类型
interface FuncTagItem {
  id: string;
  emoji: string;
  text: string;
}

// 抽离数据
const funcTags: FuncTagItem[] = [
  {
    id: 'colloquial',
    emoji: '🌐',
    text: '支持各种口语表达'
  },
  {
    id: 'multilingual',
    emoji: '🔤',
    text: '支持多语言搜索'
  },
  {
    id: 'emotional',
    emoji: '🧠',
    text: '理解情感语义'
  }
];

// 抽离标签项组件
const TagItem = memo(function TagItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">{emoji}</span>
      <span><Trans>{text}</Trans></span>
    </div>
  );
});

TagItem.displayName = 'TagItem';

// 主组件
const EmojiFuncTag = memo(function EmojiFuncTag() {
  return (
    <div className="flex justify-center gap-8 mt-12 text-sm text-gray-500">
      {funcTags.map(({ id, emoji, text }) => (
        <TagItem key={id} emoji={emoji} text={text} />
      ))}
    </div>
  );
});

EmojiFuncTag.displayName = 'EmojiFuncTag';

export default EmojiFuncTag;
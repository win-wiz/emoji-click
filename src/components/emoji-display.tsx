import { memo, useMemo } from 'react';

interface EmojiDisplayProps {
  code?: string;
  fullCode?: string;
  baseCode?: string;
  onError?: (error: Error) => void;
}

// 使用 Map 缓存已转换的 emoji
const emojiCache = new Map<string, string>();

const convertCodeToEmoji = (code: string): string => {
  // 检查缓存
  if (emojiCache.has(code)) {
    return emojiCache.get(code)!;
  }

  try {
    const emoji = code
      .split(/[\s-]+/)
      .map(c => String.fromCodePoint(parseInt(c, 16)))
      .join('');
    
    // 存入缓存
    emojiCache.set(code, emoji);
    return emoji;
  } catch (error) {
    console.error('Error converting code to emoji:', error);
    throw error;
  }
};

export const EmojiDisplay = memo(function EmojiDisplay({ 
  code, 
  fullCode, 
  baseCode,
  onError 
}: EmojiDisplayProps) {
  const emoji = useMemo(() => {
    const displayCode = fullCode || code || baseCode;
    
    if (!displayCode) return null;

    try {
      return convertCodeToEmoji(displayCode);
    } catch (error) {
      onError?.(error as Error);
      return null;
    }
  }, [fullCode, code, baseCode, onError]);
  
  if (!emoji) return null;

  return (
    <span className="emoji">
      {emoji}
    </span>
  );
});

EmojiDisplay.displayName = 'EmojiDisplay';

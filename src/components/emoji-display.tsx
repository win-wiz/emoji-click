interface EmojiDisplayProps {
  code?: string;
  fullCode?: string;
  baseCode?: string;
}

export function EmojiDisplay({ code, fullCode, baseCode }: EmojiDisplayProps) {
  const convertCodeToEmoji = (code: string) => {
    // 处理可能包含多个码点的情况（用空格或-分隔）
    const codes = code.split(/[\s-]+/);
    
    // 将每个码点转换为emoji并组合
    return codes
      .map(c => String.fromCodePoint(parseInt(c, 16)))
      .join('');
  };

  // 优先使用 fullCode，其次是 code，最后是 baseCode
  const displayCode = fullCode || code || baseCode;
  
  if (!displayCode) return null;

  return (
    <span className="emoji">
      {convertCodeToEmoji(displayCode)}
    </span>
  );
}

// 使用示例：
// <EmojiDisplay fullCode="26bd" />  // ⚽
// <EmojiDisplay fullCode="1F468 200D 1F469 200D 1F467" />  // 👨‍👩‍👧 
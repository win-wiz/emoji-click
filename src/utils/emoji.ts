export const emojiUtils = {
  codeToEmoji(code: string): string {
    if (!code) return '';

    try {
      // 移除所有空格和可能的 'U+' 前缀
      const cleanCode = code.replace(/\s+/g, '').replace(/U\+/gi, '');
      
      // 如果是单个码点
      if (cleanCode.length <= 4) {
        const codePoint = parseInt(cleanCode, 16);
        // 检查码点是否有效
        if (isNaN(codePoint) || codePoint < 0) {
          console.warn(`Invalid code point: ${code}`);
          return '';
        }
        return String.fromCodePoint(codePoint);
      }
      
      // 如果是多个码点
      const codePoints = cleanCode.match(/.{1,4}/g) || [];
      return codePoints
        .map(cp => {
          const codePoint = parseInt(cp, 16);
          // 检查每个码点是否有效
          if (isNaN(codePoint) || codePoint < 0) {
            console.warn(`Invalid code point in sequence: ${cp}`);
            return '';
          }
          return String.fromCodePoint(codePoint);
        })
        .join('');
    } catch (error) {
      console.warn(`Error converting code to emoji: ${code}`, error);
      return '';
    }
  },

  // 检查是否是有效的emoji码点
  isValidEmojiCode(code: string): boolean {
    try {
      const emoji = this.codeToEmoji(code);
      return emoji !== '';
    } catch {
      return false;
    }
  },

  // 获取emoji的HTML实体
  getEmojiHtmlEntity(code: string): string {
    try {
      const codePoint = parseInt(code, 16);
      if (isNaN(codePoint) || codePoint < 0) {
        return '';
      }
      return `&#${codePoint};`;
    } catch {
      return '';
    }
  }
};

// 使用示例：
// const emoji = emojiUtils.codeToEmoji('26bd');  // ⚽ 
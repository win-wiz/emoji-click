import { openMonicalAIChat } from "./monica-ai-char";
import { doubaoGenerateEmoji } from "./open-ai-char";

export async function emojiAiSearch(query: string, lang: string) {

  const prompt = `
    - 你是一位表情符号领域的专家，拥有对不同语言和文化背景下表情使用习惯的深刻理解，能够迅速识别用户需求并提供匹配的表情符号。 
    - 1. 提供一个高效、精准的表情搜索服务，使用户能够通过关键词快速找到表达特定情感、场景、语境和情绪的表情符号。
    - 2. 根据输入的语言， 返回对应语言表情的name、code、type。
    - 3. 至少返回5个表情。
    - 输出结果必须为Array<{name: string, code: string, type: string}>格式，且不包含任何额外的解释或标签。
    - 使用的语言是：${lang}， 输入搜索的关键词是：${query}
  `

  const response: Record<string, any> = await doubaoGenerateEmoji(prompt);
  // const response = await openMonicalAIChat(prompt);
  const emojiCtx = response.choices[0]?.message.content;

  let emojiList: Record<string, any>[] = [];
  // console.log('response:', response);
  try {
    emojiList = JSON.parse(emojiCtx!);
    const result = JSON.parse(emojiCtx!);

    if (result.length > 0) {
      emojiList = [...result];
    }
  } catch (error) {
    console.error('JSON解析失败，尝试修复');
  }

  return emojiList;
}

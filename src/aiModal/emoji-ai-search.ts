import { AVAILABLE_LOCALES } from "@/locales/config";
import { Gpt4oMimiChar } from "./gpt-4o-mimi-char";
import { openMonicalAIChat } from "./monica-ai-char";
import { doubaoGenerateEmoji } from "./open-ai-char";

export async function emojiAiSearch(query: string, lang: AVAILABLE_LOCALES) {

  // const prompt = `
    // - 你是一位表情符号领域的专家，拥有对不同语言和文化背景下表情使用习惯的深刻理解，能够迅速识别用户需求并提供匹配的表情符号。 
    // - 1. 提供一个高效、精准的表情搜索服务，使用户能够通过关键词快速找到表达特定情感、场景、语境和情绪的表情符号。
    // - 2. 根据输入的语言， 返回对应语言表情的name、code、type。
    // - 3. 至少返回5个表情, code 必须为 emoji 的 code。
    // - 输出结果必须为Array<{name: string, code: string, type: string}>格式，且不包含任何额外的解释或标签。
    // - 使用的语言是：${lang}， 输入搜索的关键词是：${query}
  // `

  let result: Record<string, any>[] = [];

  try {
    result = await doubaoGenerateEmoji(query, lang);
  } catch (error) {
    console.error('JSON解析失败，尝试修复');
  }

  return result;
}

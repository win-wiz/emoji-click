import { AVAILABLE_LOCALES } from "@/locales/config";
// import { gpt4oMimiChar } from "./gpt-4o-mimi-char";
// import { monicaGenerateEmoji } from "./monica-ai-char";
// import { doubaoGenerateEmojiBySDK } from "./open-ai-char";
import { qianwenGenerateEmoji } from "./qianwen-ai-chart";
// import { qianwenGenerateEmoji } from "./qianwen-ai-chart";

export async function emojiAiSearch(query: string, lang: AVAILABLE_LOCALES) {

  let result: Record<string, any>[] = [];

  try {
    result = await qianwenGenerateEmoji(query, lang);
    // result = await doubaoGenerateEmojiBySDK(query, lang);
  } catch (error) {
    console.error('JSON解析失败，尝试修复', error);
    result = [{
      status: 'search error',
      message: JSON.stringify(error),
    }];
  }
  return result;
}

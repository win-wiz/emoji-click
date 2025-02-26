import { AVAILABLE_LOCALES } from "@/locales/config";
import { deepseekGenerateEmoji } from "./deepseek-ai-chart";
// import { gpt4oMimiChar } from "./gpt-4o-mimi-char";
// import { monicaGenerateEmoji } from "./monica-ai-char";
import { doubaoGenerateEmoji } from "./open-ai-char";
// import { qianwenGenerateEmoji } from "./qianwen-ai-chart";

export async function emojiAiSearch(query: string, lang: AVAILABLE_LOCALES) {

  let result: Record<string, any>[] = [];

  try {
    // result = await qianwenGenerateEmoji(query, lang);
    // result = await doubaoGenerateEmoji(query, lang);
    result = await deepseekGenerateEmoji(query, lang);
    // console.log('result', result);
  } catch (error) {
    console.error('JSON解析失败，尝试修复', error);

    result = await doubaoGenerateEmoji(query, lang);
    // console.log('result', result);
    // result = [{
    //   status: 'search error',
    //   message: JSON.stringify(error),
    // }];
  }
  return result;
}

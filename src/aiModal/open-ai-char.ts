import { env } from '@/env';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { fetchApi } from './fetchApi';
// import { createOpenAI } from '@ai-sdk/openai';
// import { generateText } from 'ai';
// import { AI_EMOJI_PROMPTS, AI_MONICA_PROMPTS_SDK } from './prompts';

// const doubao = createOpenAI({
//   baseURL: env.DOUBAO_BASE_URL,
//   apiKey: env.DOUBAO_OPENAI_API_KEY!,
//   compatibility: 'compatible'
// });

const MODEL_DOUBLE_LINK_128K = env.DOUBAO_LINK_128K_MODEL!;

export async function doubaoGenerateEmoji(query: string, lang: AVAILABLE_LOCALES) {
  const url = env.DOUBAO_BASE_URL! + '/chat/completions';
  const apiKey = env.DOUBAO_OPENAI_API_KEY!;
  return fetchApi(url, MODEL_DOUBLE_LINK_128K, lang, query, apiKey);
}


// export async function doubaoGenerateEmojiBySDK(query: string, lang: AVAILABLE_LOCALES) {
//   const result = await generateText({
//     model: doubao(MODEL_DOUBLE_LINK_128K),
//     prompt: AI_MONICA_PROMPTS_SDK.replace('<lang>', lang).replace('<query>', query)
//   });
//   console.log('result===>>>>', result);
//   return JSON.parse(result.text);
// }

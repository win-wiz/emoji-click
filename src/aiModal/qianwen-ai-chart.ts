// qwen-turbo-latest
import { env } from '@/env';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { fetchApi } from './fetchApi';

export async function qianwenGenerateEmoji(query: string, lang: AVAILABLE_LOCALES) {
  const url = env.QIANWEN_BASE_URL! + '/chat/completions';
  const apiKey = env.QIANWEN_API_KEY!;
  const model = env.QIANWEN_MODEL!;
  return await fetchApi(url, model, lang, query, apiKey);
} 
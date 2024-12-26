// deepseek-chat
import { env } from '@/env';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { fetchApi } from './fetchApi';

export async function deepseekGenerateEmoji(query: string, lang: AVAILABLE_LOCALES) {
  const url = env.DEEPSEEK_BASE_URL! + '/chat/completions';
  const apiKey = env.DEEPSEEK_API_KEY!;
  const model = env.DEEPSEEK_MODEL!;
  return await fetchApi(url, model, lang, query, apiKey);
}
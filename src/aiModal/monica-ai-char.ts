import { env } from '@/env';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { fetchApi } from './fetchApi';

export async function monicaGenerateEmoji(query: string, lang: AVAILABLE_LOCALES) {
  const url = env.MONICA_BASE_URL! + '/chat/completions';
  const apiKey = env.MONICA_API_KEY!;
  // const model = 'qwen-2.5-72b-instruct';
  const model = 'deepseek-chat';
  return await fetchApi(url, model, lang, query, apiKey);
} 
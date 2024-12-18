import { AVAILABLE_LOCALES } from "@/locales/config";
import { fetchApi } from "./fetchApi";
import { env } from "@/env";

export async function gpt4oMimiChar(lang: AVAILABLE_LOCALES, query: string) {
  
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey = env.OPENAI_API_KEY!;
  const model = 'gpt-4o-mini';

  return await fetchApi(url, model, lang, query, apiKey);
}

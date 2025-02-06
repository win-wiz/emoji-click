import { AVAILABLE_LOCALES } from "@/locales/config";
import { AI_EMOJI_PROMPTS_EN, AI_EMOJI_PROMPTS_ES, AI_EMOJI_PROMPTS_FR, AI_EMOJI_PROMPTS_PT, AI_EMOJI_PROMPTS_ZH, AI_EMOJI_PROMPTS_ZH_TW } from "./prompts";

const map_prompts: Record<string, string> = {
  zh: AI_EMOJI_PROMPTS_ZH,
  en: AI_EMOJI_PROMPTS_EN,
  fr: AI_EMOJI_PROMPTS_FR,
  pt: AI_EMOJI_PROMPTS_PT,
  es: AI_EMOJI_PROMPTS_ES,
  'zh-TW': AI_EMOJI_PROMPTS_ZH_TW,
}

const map_contents: Record<string, (lang: string, query: string) => string> = {
  zh: (lang: string, query: string) => `语言：${lang}, 关键词是：${query}`,
  en: (lang: string, query: string) => `Language: ${lang}, Keywords: ${query}`,
  fr: (lang: string, query: string) => `Langue: ${lang}, Mots-clés: ${query}`,
  pt: (lang: string, query: string) => `Linguagem: ${lang}, Palavras-chave: ${query}`,
  es: (lang: string, query: string) => `Lenguaje: ${lang}, Palabras clave: ${query}`,
  'zh-TW': (lang: string, query: string) => `語言：${lang}, 關鍵詞是：${query}`,
}

export async function fetchApi(
  url: string, 
  model: string,
  lang: AVAILABLE_LOCALES,
  query: string,
  apiKey: string
) {

  const prompts = map_prompts[lang];
  // const content = lang === 'zh' ? `语言：${lang}, 关键词是：${query}` : `Language: ${lang}, Keywords: ${query}`;
  const content = lang && map_contents[lang] ? map_contents[lang](lang, query) : '';
  // console.log('prompts===>>>', prompts);
  // console.log('content===>>>', content);

  const bodyData = {
    model,
    messages: [
      {
        role: 'system',
        content: prompts
      },
      {
        role: 'user',
        content: content
      },
    ],
    parameters: {
      temperature: 0.8,    // 降低随机性，提高响应速度
      stream: false,
      max_tokens: 250,
    }
  };

  const reqBody = JSON.stringify(bodyData);
  try {

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: reqBody,
    });

    // console.log('response===>>>', response);
    const data: Record<string, any> = await response.json();

    // console.log('data===>>>', data);

    return JSON.parse(data.choices[0]?.message.content || '');
    // return data;

  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('请求超时');
    } else {
      console.error('fetchApi error===>>>>', err);
    }
    return [{
      status: 'error',
      message: JSON.stringify(err),
    }];
  }  
}
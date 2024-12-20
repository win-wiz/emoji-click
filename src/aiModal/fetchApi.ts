import { AVAILABLE_LOCALES } from "@/locales/config";
import { AI_EMOJI_PROMPTS_EN, AI_EMOJI_PROMPTS_ZH } from "./prompts";

const map_prompts: Record<string, string> = {
  zh: AI_EMOJI_PROMPTS_ZH,
  en: AI_EMOJI_PROMPTS_EN
}

export async function fetchApi(
  url: string, 
  model: string,
  lang: AVAILABLE_LOCALES,
  query: string,
  apiKey: string
) {

  const prompts = map_prompts[lang];

  const bodyData = {
    model,
    messages: [
      {
        role: 'system',
        content: prompts
      },
      {
        role: 'user',
        content: `lang: ${lang}, query: ${query}`,
      },
    ],
    parameters: {
      max_tokens: 250,     // 减少 token 数量
      temperature: 0.3,    // 降低随机性，提高响应速度
      top_p: 0.2,         // 添加 top_p 参数
      stream: false,
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
      keepalive: true,
      cache: 'no-cache',
    });

    const data: Record<string, any> = await response.json();

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
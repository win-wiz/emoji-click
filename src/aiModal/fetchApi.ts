import { AVAILABLE_LOCALES } from "@/locales/config";
import { AI_EMOJI_PROMPTS } from "./prompts";

export async function fetchApi(
  url: string, 
  model: string,
  lang: AVAILABLE_LOCALES,
  query: string,
  apiKey: string
) {

  const bodyData = {
    model,
    messages: [
      {
        role: 'system',
        content: AI_EMOJI_PROMPTS
      },
      {
        role: 'user',
        content: `lang: ${lang}, query: ${query}`,
      },
    ],
    parameters: {}
  };

  // console.log('bodyData===>>>>', bodyData);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(bodyData),
      signal: controller.signal // 添加中止信号
    });

    clearTimeout(timeoutId); // 请求成功,清除超时

    // console.log('response===>>>>', response);
    const data: Record<string, any> = await response.json();
    // console.log('doubao response===>>>>', data);
    return JSON.parse(data.choices[0]?.message.content || '');
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('请求超时');
    } else {
      console.error('fetchApi error===>>>>', err);
    }
    return [];
  }  
}
import { AVAILABLE_LOCALES } from "@/locales/config";
import { AI_EMOJI_PROMPTS_ZH } from "./prompts";

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
        content: AI_EMOJI_PROMPTS_ZH
      },
      {
        role: 'user',
        content: `lang: ${lang}, query: ${query}`,
      },
    ],
    parameters: {
      max_tokens: 100,     // 减少 token 数量
      temperature: 0.1,    // 降低随机性，提高响应速度
      top_p: 0.1,         // 添加 top_p 参数
      presence_penalty: 0, // 添加 presence_penalty
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
        'Connection': 'keep-alive',     // 保持连接
        'Accept-Encoding': 'gzip',      // 启用压缩
      },
      body: reqBody,
      cache: 'no-cache',
      priority: 'high',
      keepalive: true
    });

    const data: Record<string, any> = await response.json();

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
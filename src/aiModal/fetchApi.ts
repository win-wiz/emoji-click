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

  console.log('bodyData===>>>>', bodyData);
  try {
    const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(bodyData)
  });

  console.log('response===>>>>', response);
  const data: Record<string, any> = await response.json();
  // console.log('doubao response===>>>>', data);
  return JSON.parse(data.choices[0]?.message.content || '');
  } catch (err) {
    console.error('fetchApi error===>>>>', err);
    return [];
  }  
}
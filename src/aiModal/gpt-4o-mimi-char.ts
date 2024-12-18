import { AVAILABLE_LOCALES } from "@/locales/config";
import { AI_EMOJI_PROMPTS } from "./prompts";

export async function Gpt4oMimiChar(lang: AVAILABLE_LOCALES, query: string) {
  
  const content = JSON.stringify({
    lang,
    query
  })
  const messages = [
    {
      role: 'system', 
      content: AI_EMOJI_PROMPTS
    },
    {
      role: 'user',
      content: content
    }
  ]

  // const response = await openMonicalAIChat(messages);
  // return response;

}

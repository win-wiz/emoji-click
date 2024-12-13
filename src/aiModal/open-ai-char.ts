import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { env } from '@/env';

// const openai = new OpenAI({
//   apiKey: env.DOUBAO_OPENAI_API_KEY!,
//   baseURL: env.DOUBAO_BASE_URL
// });
const doubao = createOpenAI({
  baseURL: env.DOUBAO_BASE_URL,
  apiKey: env.DOUBAO_OPENAI_API_KEY!,
  compatibility: 'compatible'
});

const MODEL_DOUBLE_LINK_128K = 'ep-20241129111228-9bswt';

export async function doubaoGenerateEmoji(prompt: string) {
  const response = await generateText({
    model: doubao(MODEL_DOUBLE_LINK_128K),
    prompt,
  });

  console.log('doubao response===>>>>', response);
  return {
    choices: [
      {
        message: {
          content: response.text || '',
        },
      },
    ]
  }
}
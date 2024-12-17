import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { env } from '@/env';

const doubao = createOpenAI({
  baseURL: env.DOUBAO_BASE_URL,
  apiKey: env.DOUBAO_OPENAI_API_KEY!,
  compatibility: 'compatible'
});

// const MODEL_DOUBLE_LINK_128K = 'ep-20241213221042-fgbmt';
const MODEL_DOUBLE_LINK_128K = env.DOUBAO_LINK_128K_MODEL!;

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


const monica = createOpenAI({
  baseURL: env.MONICA_BASE_URL,
  apiKey: env.MONICA_API_KEY!,
  compatibility: 'compatible'
});

const MODEL_MONICA = env.MONICA_MODEL!;

export async function monicaGenerateEmoji(prompt: string) {
  const response = await generateText({
    model: monica(MODEL_MONICA),
    prompt,
  });

  console.log('monica response===>>>>', response);
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
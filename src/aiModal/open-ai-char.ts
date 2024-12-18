import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { env } from '@/env';
import { AVAILABLE_LOCALES } from '@/locales/config';
import { AI_EMOJI_PROMPTS } from './prompts';

const doubao = createOpenAI({
  baseURL: env.DOUBAO_BASE_URL,
  apiKey: env.DOUBAO_OPENAI_API_KEY!,
  compatibility: 'compatible'
});

// const MODEL_DOUBLE_LINK_128K = 'ep-20241213221042-fgbmt';
const MODEL_DOUBLE_LINK_128K = env.DOUBAO_LINK_128K_MODEL!;

export async function doubaoGenerateEmoji(query: string, lang: AVAILABLE_LOCALES) {
  const bodyData = {
    model: MODEL_DOUBLE_LINK_128K,
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
  const url = env.DOUBAO_BASE_URL! + '/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DOUBAO_OPENAI_API_KEY!}`
    },
    body: JSON.stringify(bodyData)
  });

  console.log('doubao response===>>>>', response);
  const data: Record<string, any> = await response.json();
  // console.log('doubao response===>>>>', data);
  return JSON.parse(data.choices[0]?.message.content || '');
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
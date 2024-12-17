import { env } from '@/env';
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai';

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function openMonicalAIChat(prompt: string, model = env.MONICA_MODEL!): Promise<AIResponse> {
  const requestData = {
    model,
    messages: [{ role: 'user', content: prompt }]
  };
  const requestStr = JSON.stringify(requestData);
  const url = env.MONICA_BASE_URL!;
  const key = env.MONICA_API_KEY!;

  const fetchUrl = 'https://openapi.monica.im/v1/chat/completions';
  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: requestStr
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json() as AIResponse;
}

// const openAi = createOpenAI({
//   baseURL: 'https://openapi.monica.im/v1',
//   apiKey: env.MONICA_API_KEY!,
// });

// export async function openMonicalAIChat(prompt: string, model = env.MONICA_MODEL!) {
//   const response = await generateText({
//     model: openAi(model),
//     prompt
//   });
//   console.log('response===>>>', response);
//   return response;
// }

import { env } from '@/env';

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

  const fetchUrl = url + '/chat/completions';
  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': key
    },
    body: requestStr
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json() as AIResponse;
}

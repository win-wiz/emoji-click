const openai = require('@ai-sdk/openai');
const { generateText } = require('ai');
// import openai from '@ai-sdk/openai';
// import { generateText } from 'ai';

const doubao = openai.createOpenAI({
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  apiKey: '892eb4d5-5b9c-4a8f-a62f-e234a171007f',
  compatibility: 'compatible'
});

console.log('apiKey===>>>>', process.env.DOUBAO_OPENAI_API_KEY);
// 豆包模型
const MODEL_DOUBLE_LINK_128K = 'ep-20241213221042-fgbmt';

/**
 * @param {any} prompt
 */
async function doubaoTranslate (prompt) {
  const response = await generateText({
    model: doubao(MODEL_DOUBLE_LINK_128K),
    prompt,
  });

  return {
    choices: [
      {
        message: {
          content: response.text,
        },
      },
    ],
  }
}

/**
 * @param {any} prompt
 */
async function translate (prompt) {
  return await doubaoTranslate(prompt);
}

module.exports = {
  translate,
}

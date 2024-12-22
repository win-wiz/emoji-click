const openai = require('@ai-sdk/openai');
const { generateText } = require('ai');
// import openai from '@ai-sdk/openai';
// import { generateText } from 'ai';

// 豆包
const doubao = openai.createOpenAI({
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  apiKey: '892eb4d5-5b9c-4a8f-a62f-e234a171007f',
  compatibility: 'compatible'
});
// 豆包模型
const MODEL_DOUBLE_LINK_128K = 'ep-20241213221042-fgbmt';

// 通义千问
// console.log('apiKey===>>>>', process.env.DOUBAO_OPENAI_API_KEY);
const tongyi = openai.createOpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'sk-136daf337bf84c57a29cf97e874c8332',
  compatibility: 'compatible'
});


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
async function tongyiTranslate (prompt) {
  const response = await generateText({
    model: tongyi('qwen-turbo'),
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
  // return await doubaoTranslate(prompt);
  return await tongyiTranslate(prompt);
}

module.exports = {
  translate,
}

// @ts-nocheck
const fs = require('fs').promises;
const path = require('path');
const localeNames = require('./localeConfig.cjs');
const { translate } = require('./openai-chat.cjs');

const directoryPath = path.join(__dirname, '../translations');

console.log('localeNames===>>>>', localeNames);
/**
 * @param {string} file 
 */
async function processLanguage (file) {

  const language = file.split('.')[0];

  if (language === 'zh') {
    return;
  }

  console.log(`开始翻译 ${language} 语言包`);
  console.log('file===>>>>', file);
  const content = await fs.readFile(path.join(directoryPath, file + '/messages.json'), 'utf8');
  const json = JSON.parse(content);
  const keys = Object.keys(json);

  /**
   * @type {Record<string, string>}
   */
  const needTranslateKeys = {};

  keys.forEach(key => {
    if (Object.keys(needTranslateKeys).length >= 50) {
      console.log(`翻译 ${language} 语言包超过 50 条，请多次执行， 避免遗漏`);
    } else if (json[key]['translation'] === '' || !json[key]['translation']) {
      needTranslateKeys[key] = json[key]['message'];
    }
  });

  if (Object.keys(needTranslateKeys).length === 0) {
    console.log(`${language} 语言包无需翻译`);
    return;
  }

  console.log(`需要翻译 ${Object.keys(needTranslateKeys).length} 条数据`);

  const prompt = `
    - 你是一个擅长数据处理和多语言翻译的AI专家，具备高效处理JSON数据和灵活应对多种语言需求的能力。 
    - 翻译考虑到专业术语和正式风格，适用于正式文档和官方交流。
    - 翻译的结果输出为JSON内容key保持不变，直接输出json内容不要加\`\`\`json\`\`\`标签。，不要做任何解释
    - 保证json格式准确性，确保key与内容成对出现。
    - 翻译考虑使用当地的习惯用语，而不是简单的文字翻译，了解原始文字的意境找到当地的表达方式进行翻译
    - 翻译目标语言为：${localeNames[language]}
    - 不要做任何解释，直接输出json内容，也不要输出\`\`\`json\`\`\`标签
    - 输入JSON数据：
        ${JSON.stringify(needTranslateKeys, null, 2)}
  `;

  /**
   * @type {any}
   */
  let msg = await translate(prompt);
  // console.log('openai 返回的数据：', JSON.stringify(msg, null, 2));

  msg = msg.choices[0].message.content;
  // console.log('返回的数据中包含的msg===>>>>', msg);
  /**
   * 修复JSON格式
   * @param {string} str 
   * @returns {object | null}
   */
  const safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error("JSON解析失败，尝试修复");
      str = str.replace(/[\u0000-\u001F]+/g, "");
      str = str.replace(/(["\]}])([^,\]}])/g, "$1,$2");
      str = str.replace(/([\[{])\s*,/g, "$1");
      str = str.replace(/,\s*([\]}])/g, "$1");
      try {
          return JSON.parse(str);
      } catch (e) {
          console.error("修复后仍无法解析JSON", e);
          return null;
      }
    }
  }

  msg = safeJSONParse(msg);

  if (!msg) {
    // console.error(`${language} 语言包翻译失败`);
    return;
  }

  keys.forEach(key => {
    if (msg[key]) {
      json[key].translation = msg[key]; // 翻译后的内容
    }
  });

  const jsonStr = JSON.stringify(json, null, 2);
  await fs.writeFile(path.join(directoryPath, file + '/messages.json'), jsonStr, 'utf8');
}

/**
 * 处理语言包
 * @param {Array} languages 
 * @param {number} concurrency 
 */
async function processLanguageByQueue (languages, concurrency = 3) {
  const queue = [...languages];
  const workers = new Set();
  /**
   * @type {string[]}
   */
  const results = [];

  async function processNext () {
    if (queue.length === 0) {
      return;
    }

    const language = queue.shift();
    workers.add(language);
    
    try {
      await processLanguage(language);
      results.push(`${language} 翻译成功`);
    } catch (error) {
      results.push(`${language} 翻译失败，错误信息: ${error}`);
    } finally {
      workers.delete(language);
      if (queue.length > 0) {
        await processNext();
      }
    }
  };

  const tmpWorkers = Array(Math.min(concurrency, languages.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(tmpWorkers);

  return results;
}
/**
 * 入口主函数
 */
async function main () {
  try {
    const files = await fs.readdir(directoryPath);
    const languagesToProcess = files.filter(file => file !== 'zh');
    const results = await processLanguageByQueue(languagesToProcess);
    console.log('翻译结果：', results.join('\n'));
  } catch (error) {
    console.error('翻译失败', error);
  }
}

main();
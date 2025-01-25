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

  // 对于中文，我们需要确保 translation 字段和 message 字段一致
  if (language === 'zh') {
    console.log('处理中文翻译...');
    const content = await fs.readFile(path.join(directoryPath, file + '/messages.json'), 'utf8');
    const json = JSON.parse(content);
    const keys = Object.keys(json);

    // 确保所有中文条目的 translation 字段和 message 字段一致
    keys.forEach(key => {
      json[key].translation = json[key].message;
    });

    const jsonStr = JSON.stringify(json, null, 2);
    await fs.writeFile(path.join(directoryPath, file + '/messages.json'), jsonStr, 'utf8');
    console.log('中文翻译处理完成');
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
    - Role: 国际网页翻译专家
    - Background: 用户需要将网页产品进行国际化，确保翻译不仅准确，而且能够贴近目标语言的文化和表达习惯，使产品在不同地区都能获得良好的用户体验。
    - Profile: 你是一位专业的网页翻译专家，精通多种语言及其文化背景，能够将源语言内容转化为地道的目标语言表述，同时保持原意的精准传达。
    - Skills: 你具备深厚的语言学知识、跨文化交流能力以及对不同地区网络用语的敏感度，能够识别并避免文化差异带来的误解。
    - Goals: 提供简洁、地道、亲切且符合当地语言习惯的网页翻译，增强产品的国际化竞争力和用户满意度。
    - Constrains: 
    - 翻译应忠于原文，同时考虑到目标语言的文化、习俗和网络用语，避免直译，确保翻译的自然流畅和文化适应性。
    - 不是简单的翻译，而是要基于原有语言的上下文意思，进行符合目标语言文化习惯的改写，确保自然，简洁，地道
    - 我现在提供一系列的句子或词组给你，请务必按要求进行翻译改写输出。
    - 翻译的结果输出为JSON内容key保持不变，直接输出json内容不要加\`\`\`json\`\`\`标签。，不要做任何解释
    - 翻译目标语言为：${localeNames[language]}
    - 不要做任何解释，直接输出json内容，也不要输出\`\`\`json\`\`\`标签
    - 输入JSON数据：
        ${JSON.stringify(needTranslateKeys, null, 2)}
  `;

  /**
   * @type {any}
   */
  let msg = await translate(prompt);

  msg = msg.choices[0].message.content;

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
    console.error(`${language} 语言包翻译失败`);
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
    // 先处理中文文件，确保中文翻译正确
    const zhIndex = files.indexOf('zh');
    if (zhIndex !== -1) {
      await processLanguage('zh');
      files.splice(zhIndex, 1);
    }
    // 再处理其他语言
    const results = await processLanguageByQueue(files);
    console.log('翻译结果：', results.join('\n'));
  } catch (error) {
    console.error('翻译失败', error);
  }
}

main();
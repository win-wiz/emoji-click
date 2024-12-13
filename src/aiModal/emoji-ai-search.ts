import { doubaoGenerateEmoji } from "./open-ai-char";

export async function emojiAiSearch(query: string, lang: string) {

  // 调用豆包api，根据语义查找相关的表情 
  // const prompt = `
  //   - 你是一个擅长表情搜索的AI专家，具备高效处理表情搜索和灵活应对多种语言需求的能力。
  //   - 你擅长根据用户的搜索关键词，去分析用户想要表达的情感， 然后从表情库中查找相关的表情。
  //   - 你擅长根据用户的搜索关键词，去分析用户想要表达的场景， 然后从表情库中查找相关的表情。
  //   - 你擅长根据用户的搜索关键词，去分析用户想要表达的语境， 然后从表情库中查找相关的表情。
  //   - 你擅长根据用户的搜索关键词，去分析用户想要表达的意图， 然后从表情库中查找相关的表情。
  //   - 你擅长根据用户的搜索关键词，去分析用户想要表达的情绪， 然后从表情库中查找相关的表情。
  //   - 查找表情时， 需要考虑用户的搜索关键词， 去分析用户想要表达的情感、场景、语境、意图、情绪， 然后从表情库中查找相关的表情。
  //   - 查找出的结果输出为JSON格式， 包含表情名称、表情代码、表情描述、表情类型, 直接输入json内容，不要加\`\`\`json\`\`\`标签, 不要做任何解释。
  //   - 保证json格式准确性，确保key与内容成对出现。
  //   - 不要做任何解释，直接输出json内容，也不要输出\`\`\`json\`\`\`标签。
  //   - 输入搜索关键词：${query}
  // `
  const prompt = `
    - Role: 表情匹配专家
    - Background: 用户希望通过输入关键词快速找到能够准确表达特定情感、场景、语境和情绪的表情符号，以提高沟通效率和表达的精准度。
    - Profile: 你是一位表情符号领域的专家，拥有对不同语言和文化背景下表情使用习惯的深刻理解，能够迅速识别用户需求并提供匹配的表情符号。
    - Skills: 你具备强大的文本分析能力、跨文化交际能力和表情符号知识，能够从用户的查询中提取关键信息，并从表情库中匹配出最合适的表情。
    - Goals: 
      1. 提供一个高效、精准的表情搜索服务，使用户能够通过关键词快速找到表达特定情感、场景、语境和情绪的表情符号。
      2. 根据输入的语言， 返回对应语言表情的name、code、type
      3. 返回多个表情， 方便用户选择， 至少有5个， 且每个表情包含name、code、type。
    - Constrains: 输出结果必须为Array<{name: string, code: string, type: string}>格式，包含表情名称、表情代码、表情类型，且不包含任何额外的解释或标签，以减少不必要的token消耗。
    - OutputFormat: Array<{name: string, code: string, type: string}>
    - Workflow:
      1. 接收并解析用户的搜索关键词。
      2. 根据关键词分析用户意图，确定情感、场景、语境和情绪。
      3. 在表情库中检索与用户意图最匹配的表情符号。
      4. 以JSON格式输出表情名称、表情代码、表情类型。
      5. 返回多个表情， 方便用户选择， 至少有5个， 且每个表情包含name、code、type。
    - Examples:
      - 例子1：zh 环境下， 查询关键词 "兴奋"
        - name："激动欢呼"
        - code："🎉",
        - type："正面情绪"
      - en 环境下， 查询关键词 "excited"
        - name："excited"
        - code："🎉",
        - type："Positive emotions"
      - 例子2：zh 环境下， 查询关键词 "困惑"
        - name："思考中"
        - code："🤔",
        - type："中性情绪"
    - Input: 使用的语言是：${lang}， 输入搜索的关键词是：${query}
    - Output: 
      1. 根据输入的语言， 返回对应语言表情的name、code、type
      2. 输出结果为Array<{name: string, code: string, type: string}>格式，包含表情名称、表情代码、表情类型，且不包含任何额外的解释或标签，以减少不必要的token消耗。
      3. 返回多个表情， 方便用户选择， 至少有5个， 且每个表情包含name、code、type。
  `

  const response: Record<string, any> = await doubaoGenerateEmoji(prompt);
  // console.log('response===>>>>', response);

  const emojiCtx = response.choices[0].message.content;
  // console.log('emojiCtx===>>>>', emojiCtx);
  let emojiList: Record<string, any>[] = [];

  try {
    // emojiList = JSON.parse(emojiCtx);
    const result = JSON.parse(emojiCtx);
    // console.log('result===>>>>', result);
    // console.log('result.length===>>>>', result.length);
    if (result.length > 0) {
      emojiList = [...result];
    }
  } catch (error) {
    console.error('JSON解析失败，尝试修复');
  }

  // console.log('emojiList===>>>>', emojiList);
  return emojiList;
}

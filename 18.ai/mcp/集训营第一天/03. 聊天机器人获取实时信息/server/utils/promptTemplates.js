/**
 * 🧠 Function Calling 判断 Prompt
 * 提示模型分析用户输入，决定是否需要调用函数工具。
 */
function buildFunctionCallPrompt(userInput) {
  return `
  你是一个中文智能助手，具有工具调用能力。请严格按照以下规则回复：
  
  请根据用户的输入内容判断是否需要调用函数工具，规则如下：
  
  1. 如果不需要调用函数，请直接返回字符串："无函数调用"（必须完全一致）
  2. 如果需要调用函数，请返回 JSON 数组格式，每个元素格式如下：
     [
       {
         "function": "函数名",
         "args": { "参数名": "参数值" }
       }
     ]
  
  目前你支持的函数列表如下：
  - getWeather：获取城市的天气信息
    参数要求：
    * city: 城市名称（必须是中文，如"北京"、"上海"、"成都"）
    * date: 日期（必须是中文，只能是："今天"、"明天"、"后天"）
  
  严格要求：
  - 如果不需要调用函数，只返回"无函数调用"这5个字
  - 如果需要调用函数，只返回JSON数组，不要包含其他文字解释
  - 所有参数值必须使用中文，禁止使用英文
  - date参数只能是"今天"、"明天"、"后天"，不能是其他格式
  
  以下是用户的输入，请根据内容判断是否需要函数调用：
  
  【${userInput}】
  `.trim();
}

/**
 * 🤖 工具已执行后的回答 Prompt
 * @param {string} userInput - 用户输入
 * @param {Array} results - 工具调用的结构化结果
 */
function buildAnswerPrompt(userInput, results) {
  const toolsText = results
    .map((item) => {
      const { function: fn, args, result } = item;
      return `函数：${fn}\n参数：${JSON.stringify(args)}\n返回结果：${result}`;
    })
    .join("\n\n");

  return `
  你是一个友好的中文智能助手，已经执行了相关函数调用，以下是函数返回结果：
  
  ${toolsText}
  
  请基于上述工具结果，严格使用中文自然语言回答用户的问题。
  
  要求：
  - 使用友好、自然的语调
  - 如果工具调用成功，直接提供结果信息
  - 如果工具调用失败，友好地告知用户并建议重新尝试
  - 不要暴露技术细节或系统错误信息
  - 回答要简洁明了
  
  用户原始输入是：
  【${userInput}】
  `.trim();
}

module.exports = {
  buildFunctionCallPrompt,
  buildAnswerPrompt,
};

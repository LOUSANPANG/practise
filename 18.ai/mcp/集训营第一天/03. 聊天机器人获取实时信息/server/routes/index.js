const express = require("express");
const router = express.Router();
const { buildFunctionCallPrompt, buildAnswerPrompt } = require("../utils/promptTemplates");
const { getWeather } = require("../utils/wetherHandler");

// 创建一个数组来存储对话历史
const conversations = [];

// 执行函数调用
async function executeFunctionCall(functionCall) {
  const { function: fnName, args } = functionCall;
  
  try {
    switch (fnName) {
      case "getWeather":
        const result = await getWeather(args.city, args.date);
        return {
          function: fnName,
          args,
          result,
          success: true
        };
      default:
        return {
          function: fnName,
          args,
          result: `❌ 未知的函数：${fnName}`,
          success: false
        };
    }
  } catch (error) {
    console.error(`函数调用错误 [${fnName}]:`, error);
    return {
      function: fnName,
      args,
      result: `❌ 函数执行失败：${error.message}`,
      success: false
    };
  }
}

// 非流式调用 DeepSeek API (用于函数调用判断和工具执行后的回答生成)
async function callDeepSeekAPI(messages) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API 错误: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// 流式调用 DeepSeek API (用于正常对话)
async function callDeepSeekAPIStream(messages, res) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API 错误: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim());

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.replace(/^data: /, "");
        if (dataStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(dataStr);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullResponse += delta;
            res.write(`${JSON.stringify({ response: delta })}\n`);
          }
        } catch (e) {
          console.error("JSON 解析失败", e);
        }
      }
    }
  }

  return fullResponse;
}

// 流式发送文本（用于工具调用结果）
async function sendTextAsStream(res, text) {
  const chars = text.split('');
  for (let i = 0; i < chars.length; i++) {
    res.write(`${JSON.stringify({ response: chars[i] })}\n`);
    // 快速发送，每个字符间隔10ms，模拟自然的打字速度
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

router.post("/ask", async function (req, res) {
  const question = req.body.question || "";

  try {
    console.log("🤖 收到用户问题:", question);
    
    // 设置流式返回头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // 1. 使用 Function Call Prompt 判断是否需要调用函数
    const functionCallPrompt = buildFunctionCallPrompt(question);
    // 构造消息
    const functionCallMessages = [{
      role: "user",
      content: functionCallPrompt
    }]

    const functionCallResponse = await callDeepSeekAPI(functionCallMessages);
    // 这里拿到的 functionCallResponse 就有两种情况
    // 1. 无函数调用
    // 2. [{"function": "函数名", args: { ... }}]
    
    let finalResponse = ""; // 存储模型最终的答案

    // 2. 判断是否需要调用函数
    if(functionCallResponse.trim() === "无函数调用"){
      // 说明不需要使用工具
      // 正常回答问题

      // 构造消息数组，包含对话历史
      const messages = [
        {
          role: "system",
          content: "你是一个中文智能助手，请使用中文回答用户的问题。",
        },
        // 添加历史对话
        ...conversations,
        // 添加当前用户问题
        {
          role: "user",
          content: question,
        },
      ];

      // 正常调用模型，得到模型的回答
      finalResponse = await callDeepSeekAPI(messages, res);
    } else {
      // 否则，这里就需要去调用工具
      try {
        // 解析函数调用 [{"function": "函数名", args: { ... }}]
        const functionCalls = JSON.parse(functionCallResponse);
        console.log("📞 解析的函数调用:", functionCalls);
    
        // 执行所有函数调用
        const results = [];
        for (const call of functionCalls) {
          console.log(`🚀 执行函数: ${call.function}`, call.args);
          const result = await executeFunctionCall(call);
          results.push(result);
          console.log(`✅ 函数执行结果:`, result);
        }
    
        // 使用工具执行结果生成最终回答
        const answerPrompt = buildAnswerPrompt(question, results);
        const answerMessages = [
          {
            role: "user",
            content: answerPrompt,
          },
        ];
    
        // 非流式获取回答内容
        finalResponse = await callDeepSeekAPI(answerMessages);
        console.log("🎯 工具回答生成完成，开始流式发送");
    
        // 以流式方式发送工具调用结果
        await sendTextAsStream(res, finalResponse);
    
      } catch (parseError) {
        console.error("❌ 解析函数调用失败:", parseError);
        console.error("原始响应:", functionCallResponse);
    
        // 如果解析失败，则作为普通问题处理，使用流式回答
        const normalMessages = [
          {
            role: "system",
            content: "你是一个中文智能助手，请使用中文回答用户的问题。",
          },
          ...conversations,
          {
            role: "user",
            content: question,
          },
        ];
    
        finalResponse = await callDeepSeekAPIStream(normalMessages, res);
      }
    }
    

    // 将当前对话添加到历史记录中
    conversations.push(
      {
        role: "user",
        content: question,
      },
      {
        role: "assistant",
        content: finalResponse,
      }
    );

    // 限制对话历史长度，保留最近的20条消息（10轮对话）
    if (conversations.length > 20) {
      conversations.splice(0, conversations.length - 20);
    }

    res.end();

  } catch (error) {
    console.error("❌ 处理请求时发生错误:", error);
    res.write(`${JSON.stringify({ error: "服务器内部错误，请稍后重试" })}\n`);
    res.end();
  }
});

// 添加清除对话历史的路由
router.post("/clear", function (req, res) {
  conversations.length = 0; // 清空对话历史
  res.json({ message: "对话历史已清除" });
});

// 添加获取对话历史的路由
router.get("/history", function (req, res) {
  res.json({ conversations });
});

module.exports = router;

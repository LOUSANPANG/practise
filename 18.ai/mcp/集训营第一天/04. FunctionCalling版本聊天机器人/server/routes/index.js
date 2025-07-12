const express = require("express");
const router = express.Router();
const { getWeather } = require("../utils/wetherHandler");

// 创建一个数组来存储对话历史
const conversations = [];

// 1. 定义可用的工具函数规范
// 不同厂商的模型能够支持的function calling 的json格式是不一样
const availableTools = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "获取指定城市和日期的天气信息",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "城市名称，如：北京、上海、广州"
          },
          date: {
            type: "string",
            description: "日期，只能是：今天、明天、后天"
          }
        },
        required: ["city", "date"]
      }
    }
  }
];

// 执行工具函数调用
async function executeToolCall(toolCall) {
  const { name: functionName, arguments: args } = toolCall.function;
  
  try {
    console.log(`🚀 执行工具函数: ${functionName}`, args);
    
    const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
    
    switch (functionName) {
      case "getWeather":
        const result = await getWeather(parsedArgs.city, parsedArgs.date);
        console.log(`✅ 工具执行成功:`, result);
        return {
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: result
        };
      default:
        console.error(`❌ 未知的工具函数: ${functionName}`);
        return {
          tool_call_id: toolCall.id,
          role: "tool", 
          name: functionName,
          content: `错误：未知的函数 ${functionName}`
        };
    }
  } catch (error) {
    console.error(`❌ 工具执行失败 [${functionName}]:`, error);
    return {
      tool_call_id: toolCall.id,
      role: "tool",
      name: functionName,
      content: `错误：${error.message}`
    };
  }
}

// 非流式调用 DeepSeek API (用于工具调用场景)
async function callDeepSeekAPIWithTools(messages, tools = null) {
  const requestBody = {
    model: "deepseek-chat",
    messages,
    stream: false,
  };
  
  // 3. 将工具带上
  if(tools && tools.length > 0){
    // 说明有工具
    requestBody.tools = tools;
    requestBody.tool_choice = "auto";
  }


  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message;
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
    throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText}`);
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
    
    // 构造消息数组，包含对话历史
    const messages = [
      {
        role: "system",
        content: "你是一个中文智能助手，请使用中文回答用户的问题。如果需要查询天气信息，可以使用getWeather工具。",
      },
      // 添加历史对话
      ...conversations,
      // 添加当前用户问题
      {
        role: "user",
        content: question,
      },
    ];

    console.log("🔍 调用 DeepSeek API，支持工具调用...");
    
    // 2. 使用 Function Calling API
    // 将用户的消息和工具箱
    const assistantMessage = await callDeepSeekAPIWithTools(messages, availableTools)
    

    let finalResponse = "";

    // 检查是否需要调用工具
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("🔧 检测到工具调用，开始执行...");
      
      // 将助手消息添加到对话历史
      messages.push(assistantMessage);
      
      // 执行所有工具调用
      for (const toolCall of assistantMessage.tool_calls) {
        const toolResult = await executeToolCall(toolCall);
        messages.push(toolResult);
      }
      
      console.log("🎯 工具执行完成，获取最终回答...");
      
      // 再次调用 API 获取基于工具结果的最终回答
      const finalMessage = await callDeepSeekAPIWithTools(messages);
      finalResponse = finalMessage.content || "抱歉，我无法生成回答。";
      
      console.log("💬 最终回答生成完成，开始流式发送");
      
      // 以流式方式发送工具调用结果
      await sendTextAsStream(res, finalResponse);
      
    } else {
      console.log("📝 无需工具调用，使用流式回答");
      
      // 直接流式返回AI回答
      if (assistantMessage.content) {
        // 如果第一次调用就有内容，先发送这部分
        await sendTextAsStream(res, assistantMessage.content);
        finalResponse = assistantMessage.content;
      } else {
        // 否则进行流式调用
        finalResponse = await callDeepSeekAPIStream(messages, res);
      }
    }

    console.log("💬 对话完成:", finalResponse);

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

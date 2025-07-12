const express = require("express");
const router = express.Router();
const { callMCPTool, getAvailableTools, reloadConfig, getServerStatus } = require("../utils/mcpWeatherAdapter");

// 创建一个数组来存储对话历史
const conversations = [];

// 获取可用工具（转换为Function Calling格式）
async function getAvailableFunctionTools() {
  const mcpTools = await getAvailableTools();
  return mcpTools; // 新的适配器已经返回正确的格式
}

// 执行工具函数调用（通过MCP适配器）
async function executeToolCall(toolCall) {
  const { name: functionName, arguments: args } = toolCall.function;
  
  try {
    console.log(`执行工具函数: ${functionName}`, args);
    
    const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
    
    // 通过MCP适配器调用工具，返回字符串结果
    const content = await callMCPTool(functionName, parsedArgs);
    
    console.log(`工具执行成功:`, content);
    return {
      tool_call_id: toolCall.id,
      role: "tool",
      name: functionName,
      content: content
    };
  } catch (error) {
    console.error(`工具执行失败 [${functionName}]:`, error);
    return {
      tool_call_id: toolCall.id,
      role: "tool",
      name: functionName,
      content: `错误：${error.message}`
    };
  }
}

// 非流式调用 DeepSeek API (用于工具调用场景)
async function callDeepSeekAPIWithTools(messages, tools = null, retries = 3) {
  const requestBody = {
    model: "deepseek-chat",
    messages,
    stream: false,
  };
  
  if (tools && tools.length > 0) {
    requestBody.tools = tools;
    requestBody.tool_choice = "auto";
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 调用 DeepSeek API (第 ${attempt} 次尝试)...`);
      
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`DeepSeek API 调用成功 (第 ${attempt} 次尝试)`);
      return data.choices?.[0]?.message;
      
    } catch (error) {
      console.error(`DeepSeek API 调用失败 (第 ${attempt} 次尝试):`, error.message);
      
      if (attempt === retries) {
        throw error; // 最后一次尝试失败，抛出错误
      }
      
      // 等待一段时间后重试
      const waitTime = attempt * 1000; // 1秒, 2秒, 3秒
      console.log(`等待 ${waitTime}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// 流式调用 DeepSeek API (用于正常对话)
async function callDeepSeekAPIStream(messages, res, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 调用流式 DeepSeek API (第 ${attempt} 次尝试)...`);
      
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
        const errorText = await response.text();
        throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText} - ${errorText}`);
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

      console.log(`流式 DeepSeek API 调用成功 (第 ${attempt} 次尝试)`);
      return fullResponse;
      
    } catch (error) {
      console.error(`流式 DeepSeek API 调用失败 (第 ${attempt} 次尝试):`, error.message);
      
      if (attempt === retries) {
        throw error; // 最后一次尝试失败，抛出错误
      }
      
      // 等待一段时间后重试
      const waitTime = attempt * 1000;
      console.log(`等待 ${waitTime}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
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
    
    // 检查 API 密钥
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error("未设置 DEEPSEEK_API_KEY 环境变量");
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`${JSON.stringify({ error: "服务器配置错误，请联系管理员" })}\n`);
      res.end();
      return;
    }
    
    // 设置流式返回头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // 获取可用工具列表
    const availableTools = await getAvailableFunctionTools();
    console.log("当前可用工具:", availableTools.map(t => t.function.name));
    
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
    
    // 第一步：使用 Function Calling API
    const assistantMessage = await callDeepSeekAPIWithTools(messages, availableTools);
    console.log("AI回复:", assistantMessage);

    let finalResponse = "";

    // 检查是否需要调用工具
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("检测到工具调用，开始执行...");
      
      // 将助手消息添加到对话历史
      messages.push(assistantMessage);
      
      // 执行所有工具调用
      for (const toolCall of assistantMessage.tool_calls) {
        const toolResult = await executeToolCall(toolCall);
        messages.push(toolResult);
      }
      
      console.log("工具执行完成，获取最终回答...");
      
      // 再次调用 API 获取基于工具结果的最终回答
      const finalMessage = await callDeepSeekAPIWithTools(messages);
      finalResponse = finalMessage.content || "抱歉，我无法生成回答。";
      
      console.log("最终回答生成完成，开始流式发送");
      
      // 以流式方式发送工具调用结果
      await sendTextAsStream(res, finalResponse);
      
    } else {
      console.log("无需工具调用，使用流式回答");
      
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

    console.log("对话完成:", finalResponse);

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
    console.error("处理请求时发生错误:", error);
    
    // 根据错误类型返回更具体的错误信息
    let errorMessage = "服务器内部错误，请稍后重试";
    
    if (error.message.includes("ECONNRESET") || error.message.includes("fetch failed")) {
      errorMessage = "网络连接错误，请检查网络或稍后重试";
    } else if (error.message.includes("DeepSeek API")) {
      errorMessage = "AI 服务暂时不可用，请稍后重试";
    } else if (error.message.includes("MCP")) {
      errorMessage = "天气查询服务暂时不可用，请稍后重试";
    }
    
    res.write(`${JSON.stringify({ error: errorMessage })}\n`);
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

// 添加获取MCP工具信息的路由
router.get("/tools", async function (req, res) {
  try {
    const functionTools = await getAvailableFunctionTools();
    res.json({ 
      function_tools: functionTools
    });
  } catch (error) {
    console.error("获取工具信息失败:", error);
    res.status(500).json({ error: "获取工具信息失败" });
  }
});

// 添加获取MCP服务器状态的路由
router.get("/mcp/status", function (req, res) {
  try {
    const status = getServerStatus();
    res.json({ 
      servers: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("获取服务器状态失败:", error);
    res.status(500).json({ error: "获取服务器状态失败" });
  }
});

// 添加重新加载MCP配置的路由
router.post("/mcp/reload", async function (req, res) {
  try {
    console.log("🔄 收到重新加载MCP配置请求");
    await reloadConfig();
    res.json({ 
      message: "MCP配置重新加载成功",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("重新加载MCP配置失败:", error);
    res.status(500).json({ error: "重新加载配置失败" });
  }
});

// 添加获取详细工具信息的路由（包括服务器来源）
router.get("/mcp/tools", async function (req, res) {
  try {
    const functionTools = await getAvailableTools();
    const serverStatus = getServerStatus();
    
    // 按服务器分组工具
    const toolsByServer = {};
    
    for (const tool of functionTools) {
      const serverName = tool.function._mcpServer;
      if (!toolsByServer[serverName]) {
        toolsByServer[serverName] = [];
      }
      toolsByServer[serverName].push(tool);
    }
    
    res.json({
      total_tools: functionTools.length,
      tools_by_server: toolsByServer,
      server_status: serverStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("获取详细工具信息失败:", error);
    res.status(500).json({ error: "获取详细工具信息失败" });
  }
});

module.exports = router;

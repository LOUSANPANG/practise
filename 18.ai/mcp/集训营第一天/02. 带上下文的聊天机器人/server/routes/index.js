const express = require("express");
const router = express.Router();

// 1. 创建一个数组来存储对话历史
const conversations = [];

router.post("/ask", async function (req, res) {
  const question = req.body.question || "";

  // 2. 构造消息数组，包含对话历史
  const messages = [
    {
      role: "system",
      content: "你是一个中文智能助手，请使用中文回答用户的问题。",
    },
    // 添加历史对话
    ...conversations,
    {
      role: "user",
      content: question,
    },
  ]
  

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, // 使用 .env 中的 API Key
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true,
    }),
  });

  // 流式返回设置
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  
  // 用于收集完整的AI回复
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

  // 3. 将这一次对话添加到历史记录中
  conversations.push(
    {
      role: "user",
      content: question
    },
    {
      role: "assistant",
      content: fullResponse
    }
  )


  // 4. 限制对话历史长度，保留最近的20条消息（10轮对话）
  if(conversations.length > 20)
    conversations.splice(0, conversations.length - 20);

  res.end();
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

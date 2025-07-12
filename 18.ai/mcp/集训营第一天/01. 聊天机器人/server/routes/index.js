const express = require("express");
const router = express.Router();

router.post("/ask", async function (req, res) {
  // 1. 获取用户的问题
  const question = req.body.question || "";

  // 2. 构造消息数组
  const messages = [
    {
      role: "system",
      content: "你是一个中文智能助手，请使用中文回答用户的问题。"
    },
    {
      role: "user",
      content: question
    }
  ]

  // 3. 请求官方模型
  const response = await fetch("https://api.deepseek.com/chat/completions",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true
    })
  })

  // 流式返回设置
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

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
            res.write(`${JSON.stringify({ response: delta })}\n`);
          }
        } catch (e) {
          console.error("JSON 解析失败", e);
        }
      }
    }
  }

  res.end();
});

module.exports = router;

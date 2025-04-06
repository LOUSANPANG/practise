export function useOpenAIStream({ apiKey, messages, onMessage, onDone, onError }) {
  let controller = new AbortController()

  const start = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          stream: true
        }),
        signal: controller.signal
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          onDone?.()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'))

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') {
            onDone?.()
            return
          }

          try {
            const jsonStr = line.replace('data: ', '')
            const json = JSON.parse(jsonStr)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) {
              onMessage?.(delta)
            }
          } catch (err) {
            console.warn('解析失败:', err, line)
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('请求已中止')
      } else {
        onError?.(err)
      }
    }
  }

  const stop = () => {
    controller.abort()
  }

  return { start, stop }
}


// 使用
const { start, stop } = useOpenAIStream({
  apiKey: 'sk-xxxxx',
  messages: [
    { role: 'system', content: '你是一个助手' },
    { role: 'user', content: '说说 Vue3 的特点' }
  ],
  onMessage: (delta) => {
    // 每次收到内容
    content.value += delta
  },
  onDone: () => {
    console.log('生成完毕')
  },
  onError: (err) => {
    console.error('发生错误：', err)
  }
})

// 开始调用
start()

// 用户点击“停止”
stop()

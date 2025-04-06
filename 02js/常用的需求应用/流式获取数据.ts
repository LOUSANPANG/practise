interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface useStreamOptions {
  url: string,
  apiKey: string
  messages: ChatMessage[]
  onMessage?: (delta: string) => void
  onDone?: () => void
  onError?: (error: unknown) => void
}

interface OpenAIStreamHandler {
  start: () => Promise<void>
  stop: () => void
}

export function useStream({
  url,
  apiKey,
  messages,
  onMessage,
  onDone,
  onError
}: useStreamOptions): OpenAIStreamHandler {
  const controller = new AbortController()

  const start = async () => {
    try {
      const response = await fetch(url, {
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

      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')

      if (!reader) {
        throw new Error('ReadableStream not supported')
      }

      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          onDone?.()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('data:'))

        for (const line of lines) {
          if (line === 'data: [DONE]') {
            onDone?.()
            return
          }

          try {
            const jsonStr = line.replace(/^data:\s*/, '')
            const json = JSON.parse(jsonStr)
            const delta: string | undefined = json.choices?.[0]?.delta?.content
            if (delta) {
              onMessage?.(delta)
            }
          } catch (err) {
            console.warn('解析 JSON 失败：', err, line)
          }
        }
      }
    } catch (err) {
      if ((err as any).name === 'AbortError') {
        console.log('请求已被手动中止')
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
// import { ref } from 'vue'
// import { useStream } from './useStream'
// const content = ref('')
// const { start, stop } = useStream({
//   url: '',
//   apiKey: 'sk-xxx', // 建议从后端传
//   messages: [
//     { role: 'system', content: '你是一个 Vue3 专家' },
//     { role: 'user', content: 'Vue3 的优势有哪些？' }
//   ],
//   onMessage: (delta) => {
//     content.value += delta
//   },
//   onDone: () => {
//     console.log('完成生成')
//   },
//   onError: (err) => {
//     console.error('发生错误:', err)
//   }
// })
// start()
// stop() 可用于停止请求，例如用户点击“停止”按钮时

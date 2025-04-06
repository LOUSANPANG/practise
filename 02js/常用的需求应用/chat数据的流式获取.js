
const response = await fetch('/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    "Authorization": "Bearer "
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: '讲个故事,字数在五十个字左右'
    }],
    stream: true
  })
})
const reader = response.body.getReader()
const decoder = new TextDecoder('utf-8')

while (true) {
  const { value, done } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value, { stream: true })
  const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'))
  for (const line of lines) {
    if (line.trim() === 'data: [DONE]') break
    const jsonStr = line.replace('data: ', '')
    const json = JSON.parse(jsonStr)
    const delta = json.choices?.[0]?.delta?.content
    if (delta) {
      question.value[0] += delta
      console.log(11111, delta)
    }
  }
}

async function getResponse(content) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  })
  const reader = resp.body.getReader()

  while (true) {
    const { done, value} = await reader.read()
    if (done) break
    const txt = new TextDecoder().decode(value)
    console.log(txt)
  }
}

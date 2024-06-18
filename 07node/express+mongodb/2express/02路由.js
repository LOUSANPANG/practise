const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.end('home')
})

app.post('/login', (req, res) => {
  res.end('login login')
})

app.all('/test', (req, res) => {
  res.end('test')
})

app.all('*', (req, res) => {
  res.end('404 Not Found')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})

const express = require('express')

const app = express()

app.get('/', (req, res) => {
  console.log(req.method)
  console.log(req.headers)
  console.log(req.ip)
  console.log(req.url)
  console.log(req.path)
  console.log(req.query) // ?a=1 => { a:1 }

  console.log(req.get('token')) // 获取请求头的某个信息

  res.end('home')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
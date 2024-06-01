const express = require('express')

const app = express()

app.get('/response', (req, res) => {
  // 原生响应
  // res.statusCode = 200
  // res.statusMessage = '成功'
  // res.setHeader('xx', 'yy')
  // res.write('hello express')
  // res.end('response')

  // express响应
  // res.status = 500
  // res.set('xx', 'yy')
  // res.send('你好 express')

  res.status(300).set('xx', 'yy').send('hello express')
})

app.get('/response1', (req, res) => {
  // 跳转响应
  // res.redirect('https://www.baidu.com')
  
  // 下载响应
  // res.download(__dirname + '/package.json')
  
  // JSON 响应
  // res.json({
  //   name: 'test'
  // })

  // 响应文件内容
  // res.sendFile(__dirname + '/test.html')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
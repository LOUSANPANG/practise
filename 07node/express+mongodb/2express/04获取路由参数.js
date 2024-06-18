const express = require('express')

const app = express()

app.get('/:id.html', (req, res) => {
  res.setHeader('content-type', 'text/html;charset=utf-8')

  // 获取URL路由参数
  console.log(req.params.id)

  res.end('商品详情')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
/**
 * 流程：
 *  浏览器 请求 服务
 *  服务设置好cookie 返回 浏览器cookie
 *  浏览器拿到服务后，由于浏览器机制自动将响应的cookie值存储
 *  浏览器再请求服务时，会自动带着第一次服务返回给浏览器时的cookie值
 */

const express = require('express')
const cookieParse = require('cookie-parse')

const app = express()
app.use(cookieParse)

app.get('/set-cookie', (req, res) => {
  // 设置cookie 关闭浏览器会自动销毁
  res.cookie('name', 'Mike')
  res.send('设置成功')
})

app.get('/set-cookie2', (req, res) => {
  // 设置cookie的实效
  res.cookie('name', 'Mike', { maxAge: 60 * 1000 }) // 60s
  res.send('设置成功')
})

app.get('/remove-cookie', (req, res) => {
  // 删除cookie
  res.clearCookie('name')
  res.send('删除成功')
})

app.get('/get-cookie', (req, res) => {
  // 通过 cookie解析工具，获取cookie，解析工具会自动解析
  console.log(111, req.cookies)
  res.send('读取成功')
})

app.listen(3000)

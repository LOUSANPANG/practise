const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()


// 全局中间件
const recordMiddleware = (req, res, next) => {
  let { url, ip } = req
  fs.appendFile(path.resolve(__dirname, './record.log'), `url: ${url}, ip: ${ip}\n`, (err) => {
    if (err) {
      console.log(err)
    }
  })
  next()
}
app.use(recordMiddleware)
app.get('/home', (req, res) => {
  res.end(`<h1>Home</h1>`)
})


// 路由中间件
const checkLogin = (req, res, next) => {
  let isLogin = req.query.token
  if (isLogin) {
    next()
  } else {
    res.end('please login')
  }
}
app.get('/index', checkLogin, (req, res) => {
  res.end(`<h1>index</h1>`)
})
app.get('/test', checkLogin, (req, res) => {
  res.end(`<h1>test</h1>`)
})


// 静态资源中间件
// 可以直接访问public下的静态资源
// http://localhost:3000/index.html
app.use(express.static(__dirname+'/public'))


app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})

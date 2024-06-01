// pnpm install mongoose

// 引入
const mongoose = require('mongoose')

// 连接 协议+IP地址+端口+数据库名称,不存在会自动创建
mongoose.connect('mongodb://127.0.0.1:27017/lousanpang')

// 设置回调
// mongoose.connection.on('open', () => {
//   console.log('连接成功')
// })
mongoose.connection.once('open', () => {
  console.log('连接成功')
  // app.listen(8080)
})
mongoose.connection.on('error', () => {})
mongoose.connection.on('close', () => {
  console.log('关闭成功')
})

// setTimeout(() => {
//   mongoose.disconnect()
// }, 5000)

// 运行该文件，node xx.js
// 运行前确保mongod服务开启

// db.js
module.exports = function (success, error) {

  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/lousanpang')
  
  mongoose.connection.once('open', () => {
    success()
  })

  mongoose.connection.once('error', () => {
    error()
  })

}


// model.js
const mongoose = require('mongoose')
let BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number
})
let BookModel = mongoose.model('books', BookSchema)
module.exports = BookModel


// 导入
const db = require('./db.js')
const model = require('./model.js')
db(
  () => {
    console.log('连接成功')
    // model.create({})
    // ....
  },
  () => {
    console.log('连接失败')
  },
)

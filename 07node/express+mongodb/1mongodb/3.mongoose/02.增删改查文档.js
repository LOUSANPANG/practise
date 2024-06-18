// 在mongosh命令中，使用 show dbs - use lousanpang - show collections - db.books.find() 可以查看集合下的数据文档

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/lousanpang')

mongoose.connection.on('error', () => {
  console.log('连接失败')
})
mongoose.connection.on('close', () => {
  console.log('连接关闭')
})
mongoose.connection.once('open', () => {
  // 创建文档结构对象
  // 数据库字段类型：String Number Boolean Array Date Buffer Mixed任意类型(mongoose.Schema.Types.Mixed) ObjectId对象ID(mongoose.Schema.Types.ObjectId) Decimal128高精度数字(mongoose.Schema.Types.Decimal128)
  let BookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true // 唯一
    },
    author: {
      type: String,
      required: true,
      default: '佚名'
    },
    price: Number,
    style: {
      type: String,
      enum: ['文学', '历史', '科技', '教育', '其他']
    },
  })

  // 创建模型对象，对文档操作的封装对象
  // books为集合
  // mongoose 创建的集合名称都为复数，如Book -> books
  let BookModel = mongoose.model('books', BookSchema)

  // 新增===>
  BookModel.create({
    name: '西游记',
    author: '吴承恩',
    price: 99,
    style: '文学'
  })
    .then(res => {
      console.log(111, res)
    })
    .catch(err => {
      console.log(222, err)
    })
    .finally(() => {
      mongoose.disconnect()
    })
})



// 删除文档==>
// 批量删除
BookModel.deleteMany({style: '文学'})
  .then(res => {
    console.log(111, res)
  })
  .catch(err => {
    console.log(222, err)
  })
  .finally(() => {
    mongoose.disconnect()
  })

// 删除一个
BookModel.deleteOne({name: '西游记'})
  .then(res => {
    console.log(111, res)
  })
  .catch(err => {
    console.log(222, err)
  })
  .finally(() => {
    mongoose.disconnect()
  })


// 修改文档==>
// 批量修改
BookModel.updateMany({style: '文学'}, {price: 88})
  .then(res => {
    console.log(111, res)
  })
  .catch(err => {
    console.log(222, err)
  })
  .finally(() => {
    mongoose.disconnect()
  })
// 修改一个
BookModel.updateOne({name: '西游记'}, {price: 88})
  .then(res => {
    console.log(111, res)
  })
  .catch(err => {
    console.log(222, err)
  })
  .finally(() => {
    mongoose.disconnect()
  })

// 查询文档==>
// 批量获取
BookModel.find({ style: '文学' })
.then(res => {
  console.log(111, res)
})
.catch(err => {
  console.log(222, err)
})
.finally(() => {
  mongoose.disconnect()
})
// 查询所有
BookModel.find()
.then(res => {
  console.log(111, res)
})
.catch(err => {
  console.log(222, err)
})
.finally(() => {
  mongoose.disconnect()
})
// 根据ID查询
BookModel.findById('1')
.then(res => {
  console.log(111, res)
})
.catch(err => {
  console.log(222, err)
})
.finally(() => {
  mongoose.disconnect()
})
// 查询一个
BookModel.findOne({name: '西游记'})
.then(res => {
  console.log(111, res)
})
.catch(err => {
  console.log(222, err)
})
.finally(() => {
  mongoose.disconnect()
})

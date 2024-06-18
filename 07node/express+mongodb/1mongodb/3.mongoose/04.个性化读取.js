const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lousanpang');
mongoose.connection.on('error', () => {
  console.log('连接失败');
});
mongoose.connection.on('close', () => {
  console.log('连接关闭');
});
mongoose.connection.once('open', () => {
  let BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
  })
  let BookModel = mongoose.model('books', BookSchema);


  // 个性化读取
  // 只返回名字和作者字段
  BookModel.find().select({ name: 1, author: 1, id: 0 }).exec((err, docs) => {
    if (err) {
      console.log('查询失败');
      return;
    }
    console.log(docs);
  })

  // 数据排序
  // 1 升序 -1 降序
  BookModel.find().sort({ price: 1 }).exec((err, docs) => {
    if (err) {
      console.log('查询失败');
      return;
    }
    console.log(docs);
  })

  // 数据截断
  // skip 跳过多少条 limit 返回多少条
  // 相当于分页
  BookModel.find().skip(10).limit(10).exec((err, docs) => {
    if (err) {
      console.log('查询失败');
      return;
    }
    console.log(docs);
  })
  
})

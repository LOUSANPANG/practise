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


  // 条件查询
  // < 50
  // BookModel.find({ price: { $lt: 50 } })
  // <= 50
  // BookModel.find({ price: { $lte: 50 } })
  // > 50
  // BookModel.find({ price: { $gt: 50 } })
  // >= 50
  // BookModel.find({ price: { $gte: 50 } })
  // != 50
  // BookModel.find({ price: { $ne: 50 } })
  // in [50, 100]
  // BookModel.find({ price: { $in: [50, 100] } })
  // nin [50, 100]
  // BookModel.find({ price: { $nin: [50, 100] } })
  // or
  // BookModel.find({ $or: [{ price: 50 }, { price: 100 }] })
  // and
  // BookModel.find({ $and: [{ price: 50 }, { price: 100 }] })
  // BookModel.find({ $and: [{ price: { $gt: 50 } }, { price: { $lt: 100 } }] })
  // not
  // BookModel.find({ price: { $not: { $lt: 50 } } })
  // nor
  // BookModel.find({ $nor: [{ price: 50 }, { price: 100 }] })
  // type
  // BookModel.find({ price: { $type: 'number' } })
  // mod
  // BookModel.find({ price: { $mod: [5, 0] } })
  // regex
  // BookModel.find({ name: /^西/ })
  // BookModel.find({ name: new RegExp('西') })
  // BookModel.find({ name: { $regex: /^西/ } })
  // where
  // BookModel.find({ $where: 'this.price > 50' })
})

// 导出
// module.exports = xx
// exports.fn = fn
// exports = module.exports = {}

// exports = module.exports = { a: 1 }
// exports.a = 2


// 导入 fs推荐使用绝对路径，而模块则推荐使用相对路径
// require('./xx')


// 1、导入js、json文件时，会自动省略后缀，导入其他文件时，必须加上后缀，js优先json文件
// 2、导入文件夹时，首先检查文件夹下是否有package.json文件，如果有，则按照package.json文件中的main字段导入，如果没有，则查找文件夹下是否有index.js文件，如果有，则导入index.js、index.json文件，如果没有，则报错


// 导入模块的基本流程
// 1、路径分析 相对路径转换为绝对路径，定位目标文件
// 2、缓存检测
// 3、读取目标文件代码
// 4、包裹为一个函数并执行，通过 arguments.callee.toString() 可以查看包裹后的代码
// 5、缓存模块的值
// 6、返回 module.exports 的值


// CommonJS规范
// Nodejs

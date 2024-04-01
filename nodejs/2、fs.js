const fs = require('fs');


// fs的相对路径bug
// fs的相对路径参照物：命令行的工作目录
// 所以基本使用绝对路径，或者使用__dirname获取当前文件所在目录
// __dirname: 当前文件所在目录
// __dirname + '/xxxx.js'


// 文件写入
// fs.writeFile('./fs-write.txt', 'Hello Node.js', { flag: 'a' }, (err) => {
//   if (err) throw err;
//   console.log('文件已保存');
// });
// 同步
// fs.writeFileSync('./fs-write.txt', 'Hello Node.js Sync');


//追加文本
// fs.appendFile('./fs-write.txt', '追加文本', (err) => {
//   if (err) throw err;
//   console.log('文件已追加');
// });
// fs.appendFileSync('./fs-write.txt', '\r\n追加文本 Sync');


// 流式写入
// const ws = fs.createWriteStream('./fs-stream.txt');
// ws.write('1\r\n');
// ws.write('2\r\n');
// ws.write('3\r\n');
// ws.end();


// 读取
// 不设置编码格式，返回的是Buffer对象
// fs.readFile('./fs-write.txt', 'utf8', (err, data) => {
//   if (err) throw err;
//   console.log(data);
// })
// 同步
// const data = fs.readFileSync('./fs-write.txt', 'utf8');
// console.log(data);

// 流式读取
// const rs = fs.createReadStream('./fs-write.txt');
// rs.on('data', (chunk) => {
//   console.log(chunk.toString());
// });
// rs.on('end', () => {
//   console.log('读取完毕');
// });

// rs.pipe(ws); // 读取流交给写入流


// 重命名
// 异步
// fs.rename('./fs-write.txt', './fs-write-rename.txt', (err) => {
//   if (err) throw err;
//   console.log('重命名成功');
// });
// 同步
// fs.renameSync('./fs-write-rename.txt', './fs-write.txt');
// console.log('重命名成功');


// 文件移动
// fs.rename('./fs-write.txt', '../fs-write.txt', (err) => {
//   if (err) throw err;
//   console.log('移动成功');
// });
// fs.renameSync('../fs-write.txt', './fs-write.txt');
// console.log('移动成功');


// 删除文件
// fs.unlink('./fs-write.txt', (err) => {
//   if (err) throw err;
//   console.log('删除成功');
// });
// fs.unlinkSync('./fs-stream.txt');

// fs.rm('./a.txt', (err) => {
//   if (err) throw err;
//   console.log('删除成功');
// });
// fs.rmSync('./a.txt');


// 创建目录
// fs.mkdir('./a', (err) => {
//   if (err) throw err;
//   console.log('创建成功');
// });
// 递归创建目录
// fs.mkdir('./a/b/c', { recursive: true }, (err) => {
//   if (err) throw err;
//   console.log('创建成功');
// });
// 读取文件夹
// fs.readdir('./', (err, files) => {
//   if (err) throw err;
//   console.log(files); // 返回数组，文件名组成
// });
// 删除文件夹 (文件夹不是空的不能删除,使用递归删除)
// fs.rmdir('./a', (err) => {
//   if (err) throw err;
//   console.log('删除成功');
// });
// 递归删除文件夹
// fs.rmdir('./a', { recursive: true }, (err) => {
//   if (err) throw err;
//   console.log('删除成功');
// });
// fs.rm('./a', { recursive: true }, (err) => {
//   if (err) throw err;
//   console.log('删除成功');
// });


// 查看资源状态
// fs.stat('./buffer.js', (err, stats) => {
//   if (err) throw err;
//   console.log(stats);
//   // isFile() 是否是文件
//   console.log(stats.isFile());
//   // isDirectory() 是否是文件夹
//   console.log(stats.isDirectory());
// });
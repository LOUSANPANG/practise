const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // 蛇追状态码
  // res.statusCode = 200;
  // res.statusMessage = 'OKOK';

  // 设置响应头
  res.setHeader('content-type', 'text/html;charset=utf-8');
  res.setHeader('token', '123456');

  // 设置响应体 （有write就不需要在end中设置内容）
  // res.write('欢迎')
  // res.write('进入')
  // res.write('首页')
  // res.end();  // 必须要有end方法，否则浏览器会一直等待

  // res.end(`<div style="color: red;">你好<div>`)

  const html = fs.readFileSync(__dirname + '/assets/1.html')
  res.end(html);
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
})

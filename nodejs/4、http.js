/**
 * 协议
 * 
 *  
 * 报文
 * 
 *  请求报文
 *    请求行（GET /index.html HTTP/1.1）
 *       请求方法：GET POST PUT DELETE HEAD OPTIONS TRACE CONNECT PATCH
 *       请求路径：协议名、主机名、端口号、路径、查询字符串、哈希
 *       协议版本：HTTP/1.1 2 3
 *    请求头（记录了浏览器内容）
 *    空行
 *    请求体（发送的数据）
 * 
 *  响应报文
 *    响应行
 *      协议版本：HTTP/1.1
 *      状态码：1xx 2xx 3xx 4xx 5xx
 *      状态描述：OK Not Found Internal Server Error
 *    响应头（记录了服务器相关内容，响应体相关的联系）
 *    空行
 *    响应体（HTML CSS JS 图片 视频 JSON）
 */


/**
 * IP (由十进制表示的32位的二进制数字：192.168.0.0)
 * 本地回环地址
 *  127.0.0.1 ～ 127.255.255.255
 * 局域网IP、私有IP
 *  192.168.0.0 ～192.168.255.255
 *  172.16.0.0 ～ 172.31.255.255
 *  10.0.0.0 ～ 10.255.255.255
 * 公网IP
 *  除上述之外的IP
 */


/**
 * 端口: 应用程序的数字标识，实现了不同主机上的应用程序之间的通信
 *  0 ~ 65535
 *  0 ~ 1023 知名端口
 *  1024 ~ 49151 注册端口
 *  49152 ~ 65535 动态端口
 *  80 http
 *  443 https
 *  21 ftp
 *  22 ssh
 */




// 第一步：倒入http模块
const http = require('http');


// 第二步：创建服务
const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html;charset=utf-8'); // 设置响应头 解决中文乱码
  // response.write('你好'); // 设置响应体

  // console.log(request.method, request.url, request.httpVersion); // 请求行
  // console.log(request.headers); // 请求头
  // response.end('hello world'); // 设置响应体

  // 获取请求体
  // let body = '';
  // request.on('data', (chunk) => {
  //   body += chunk.toString();
  // });
  // request.on('end', () => {
  //   console.log(body); // 请求体
  //   response.end('hello world');
  // });

  // 获取URL路径、查询字符串
  // console.log(request.url); // /search?keywords=abc
  // const url = require('url');
  // let res = url.parse(request.url, true);
  // console.log(res.pathname); // /search
  // console.log(res.query); // { keywords: 'abc' }
  // response.end('url');

  // let url = new URL(request.url, `http://${request.headers.host}`);
  // console.log(url.pathname); // /search

  response.end('访问 127.0.0.1:3000 时，会看到这句话');
});


// 第三步：监听端口
server.listen(3000, () => {
  console.log('服务启动成功');
})
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 地址输入什么地址，就会解析什么地址
  // 例如：http://localhost:3000/1.html -> 读取本地的1.html文件
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const root = __dirname + '/assets';
  let filePath = root + pathname;
  let mime = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/js',
    png: 'image/png',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    json: 'application/json'
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.setHeader('content-type', 'text/html;charset=utf-8')
      switch (err.code) {
        case 'ENOENT':
          res.statusCode = 404
          res.end('<h1>404 Not Found</h1>');
          break;
        case 'EACCES':
          res.statusCode = 403
          res.end('<h1>403 Forbidden</h1>');
          break;
        default:
          res.statusCode = 500
          res.end('<h1>500 Internal Server Error</h1>');
          break;
      }
    } else {
      let ext = path.extname(filePath).slice(1)
      let type = mime[ext]
      if (type) {
        // charset=utf-8解决文件中文乱码问题，但是如果html文件设置了，其他文件可以不用设置
        res.setHeader('content-type', type + ';charset=utf-8')
      } else {
        type = 'content-type'
        res.setHeader('content-type', 'application-octet-stream')
      }
      res.end(data);
    }
  })
})

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
})
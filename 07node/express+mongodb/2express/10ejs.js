// <% %> 这种表示内部为js语法
// <%= %> 这种表示内部为js语法，且会输出

// ejs.render(模板字符串, 变量) 返回渲染后的字符串
const ejs = require('ejs');
const fs = require('fs');
const str = fs.readFileSync('./public/10html.html', 'utf8').toString();
const template = ejs.render(str, {name: 'world'});
console.log(template)


// express 使用 ejs
const express = require('express');
const app = express();
// 设置模板引擎 ejs pug jade
app.set('view engine', 'ejs');
// 设置模板目录
app.set('views', './public');

app.get('/', (req, res) => {
  // res.render(文件名, 变量) 会自动找到views目录下的文件
  res.render('index', {name: 'world'});
});

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})
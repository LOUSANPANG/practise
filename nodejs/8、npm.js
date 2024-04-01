// 包管理工具 npm
// 配置cnpm
// npm install -g cnpm --registry=https://registry.npm.taobao.org
// 配置淘宝镜像
// npm config set registry https://registry.npm.taobao.org
// 配置yarn
// npm install -g yarn


// npm init 


// npm search <package> 搜索包


// require('package') 引入包
// 默认引入当前文件的node_modules目录下的包
// 如果没有找到，会向上级目录查找，直到当前盘符根目录


// npm root -g 查看全局包的安装目录
// yarn global dir 查看全局包的安装目录


// 修改windows执行策略
// 管理员运行powershell
// 输入 set-ExecutionPolicy RemoteSigned


// 设置环境变量Path
// 1、复制程序所在目录的路径
// 2、计算机-高级系统设置-系统属性-环境变量-系统变量-Path-编辑-新建-粘贴路径
// 3、输入程序名(如QQ)，会找path的可执行文件(exe、cmd)
// yarn 安装全局命令后，不生效，yarn全局bin文件没配置path，yarn global bin查看全局bin文件路径,手动配置path


// 配置命令别名
// 1、在package.json中配置
// "scripts": {
//     "server": "node app.js",
//     "start": "node app.js"
// }
// 2、执行 npm start 使用start命令，可以省略run
// npm run server


// 创建npm包
// 1、注册npm账号
// npm adduser
// 2、登录npm
// npm login
// 3、初始化包
// npm init
// 4、发布包
// npm publish
// 5、更新包
// npm version patch
// npm publish
// 6、删除包
// npm unpublish --force


// nvm
// nvm list available 查看可安装的node版本
// nvm install <version> 安装node版本
// nvm use <version> 使用node版本
// nvm list 查看已安装的node版本

/**
 * 1 浏览器向服务器发送请求
 * 2 服务器存储用户信息 【id:用户信息】<=== session
 * 3 服务器将 sessionId 利用cookie传递给客户端
 * 4 客户端请求服务端，将sessionid传递给服务端
 * 5 服务端拿到sessionid去匹配session里边的用户信息
 */

// express-session 中间件
// req.session.xx=xx 设置
// res.session.destroy() 销毁

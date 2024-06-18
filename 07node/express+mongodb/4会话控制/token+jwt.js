/**
 * 网页中 session cookie 比较多
 * 移动端 token比较多
 * 
 * 用户请求服务端，将用户信息给服务端
 * 服务端将数据加密返回给客户端，以token的形式
 * 客户端下次再发生请求 手动将信息 传递给服务端
 * 
 * 服务端压力小
 * 服务拓展性更强
 */


/**
 * JWT 跨域认证解决方案，可用于基于 token 的身份认证
 * JWT 使 token 的生成与校验更加规范
 * 
 * jsonwebtoken 包
 */
const jwt = require('jsonwebtoken')

// 生成
// 参数：用户数据、加密字符串、配置对象
let token = jwt.sign(
  {
  usename: 'mike'
  },
  'xxx',
  {
    expiresIn: 60
  }
)

// 校验
// 参数：密文、加密字符串、回调
jwt.verify(
  token,
  'xxx',
  (err, data) => {}
)

/**
 * 跨站请求伪造
 * 
 * A网页登录
 * B网页link、script标签src使用 A网页 的get请求服务，会自动调用 A网页服务，而且 B网页 会自动带着cookie
 * 
 * A网页改用 post请求
 */

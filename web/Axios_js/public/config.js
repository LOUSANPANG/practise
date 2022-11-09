/**
 * 导出全局变量
 * @return {object} $CONFIG 全局变量
 * @return {string} $CONFIG.host host
 * @return {user} $CONFIG.user 服务user模块
 */

var $CONFIG = (function () {
  var host = 'https://xxx.com/api/'

  return {
    host: host,
    user: host + '/user'
  }
})()
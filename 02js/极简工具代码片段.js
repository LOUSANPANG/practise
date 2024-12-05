/**
 * 1 复制文本到剪切板
 * 2 获取某个日期在当年的第几天
 * 3 将RGB颜色灰度化
 * 4 解析url的参数
 * 5 筛选对象属性
 * 6 随机HEX颜色
 * 7 随机字符
 * 8 去掉字符串中的元素标记
 * 9 数字格式化
 */


// 1 复制文本到剪切板
const copyToClipboard = (text) => navigator.clipboard.writeText(text);


// 2 获取某个日期在当年的第几天
const getDayOfYear = (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
// getDayOfYear(new Date(2022, 10, 27))


// 3 将RGB颜色灰度化
const gray = (r, g, b) => r * 0.2126 + g * 0.7152 + b * 0.0722


// 4 解析url的参数
const parseQuery = (url) => {
  q = {}
  url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (q[k] = v))
  return q
}
// parseQuery('https://www.baidu.com/?a=1&b=2') // {a: '1', b: '2'}


// 5 筛选对象属性
const pick = (obj, ...props) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => props.includes(k))
  )
// pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // {a: 1, c: 3}


// 6 随机HEX颜色
const randomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`


// 7 随机字符
const randomChar = () => Math.random().toString(36).slice(2)


// 8 去掉字符串中的元素标记
const removeTag = (fragment) =>
  new DOMParser().parseFromString(fragment, 'text/html').body.textContent || ''
// removeTag('<p>123</p>') // '123'


// 9 数字格式化
const formatNum = (str) => str.replace(/\B(?=(\d{3})+$)/g, ',')

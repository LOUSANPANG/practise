import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { message } from 'ant-design-vue'


// 跳转登陆页
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 处理错误
const errorHandle = (status, message) => {
  switch (status) {
    case 401:
      toLogin()
      break
    case 403:
      message.warning('登录过期，请重新登录', 3)
      localStorage.removeItem('token')
      setTimeout(() => toLogin(), 2000)
      break
    case 404:
      message.error('请求的资源不存在')
      break
    default:
      message.error(message)
    }
}


const Instance = axios.create({ timeout: 60 * 1000 })

// 设置post请求头
Instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截
Instance.interceptors.request.use(
  config => {
    /**
     * 1 login -> Storage
     * 2 Storage -> store
     * 3 store -> Authorization
     */
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => Promise.error(error))

// 响应拦截
Instance.interceptors.response.use(
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  error => {
    const { response } = error
    if (response) {
      const { status, message } = response
      errorHandle(status, message)
      return Promise.reject(response)
    } else {
      // 断网情况 -> 通知全局断网提示组件
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default Instance
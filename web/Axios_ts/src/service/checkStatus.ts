import type { ErrorMessageMode } from '../../types/axios'
import { useUserStore } from '../store/user'
import { Modal, message as Message } from 'ant-design-vue'


export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message'
): void {
  // TODO 定义 store actions
  const userStore = useUserStore()

  let errMessage = ''
  switch (status) {
    case 401:
      // 未登录
      errMessage = `401${msg}`
      userStore.logout()
      break
    case 403:
      // 登陆失效
      errMessage = `403${msg}`
      userStore.logout()
      break
    case 404:
      errMessage = `404${msg}`
      break
    case 500:
      errMessage = `500${msg}`
      break
    default:
      errMessage = status + msg
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      // 弹窗确认的形式提示错误信息
      Modal.error({
        title: '服务异常',
        content: errMessage
      })
    } else if (errorMessageMode === 'message') {
      // 简单的错误提示信息
      Message.error(errMessage)
    }
  }
}

import { defHttp } from '../service'
import { ErrorMessageMode } from '../../types/axios'


enum Api {
  Login = '/login'
}

/**
 * @description: 登陆接口参数
 */
interface LoginParams {
  username: string;
  password: string;
}
/**
 * @description: 登陆接口返回值
 */
interface LoginResult {
  userId: string | number;
  token: string;
}
/**
 * @description: 用户登陆接口
 */
export const loginApi = (params: LoginParams, mode: ErrorMessageMode = 'modal') => {
  return defHttp.post<LoginResult>(
    { url: Api.Login, params },
    { errorMessageMode: mode }
  )
}

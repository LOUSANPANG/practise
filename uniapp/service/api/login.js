import CONFIG from '@/config.js'
import $API from '../service-base/http-interceptors.js'

export const postLogin = (data) => {
	return $API.post(CONFIG.root1 + '/userLogin', data)
}


// 如何使用
// import { postLogin } from '@/services/api/login.js'

// try {
// 	const loginRes = await postLogin({ code: '' })
// 	// TODO success
// 	console.log(loginRes)
// } catch(e) {
// 	//TODO fail code !== '1000' & return Promise.reject()
// 	console.log(e)
// }
// user模块接口列表
import http from '@/request/http'
import qs from 'qs'

const user = {
  userDetail (id, params) {        
    return http.get(`${$CONFIG.user}/${id}`, { params });    
  },
  userInfo (params) {        
    return axios.post(`${$CONFIG.user}/info`, qs.stringify(params));    
  }
}

export default user
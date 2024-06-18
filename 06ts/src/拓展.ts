// 扩展 String 类型
declare global {
  interface String {
    /**
     * @description: 用于字符串的拓展
     * @param {type} 
     * @return: 
     */
    trim(x: string): string
  }
}

// 扩展 axios
declare module 'axios' {
  export interface AxiosInstance {
    _autoLoading?: boolean
  }
}
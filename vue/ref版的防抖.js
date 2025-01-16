import { customRef } from 'vue'

export function useThrottleRef(value, delay = 200) {
  let timer
  return customRef((track, trigger) => {
    return {
      get() {
        // 依赖收集
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          // 派发更新
          trigger()
        }, delay)
      }
    }
  })
}

import { registerMicroApps, initGlobalState, start } from 'qiankun'


registerMicroApps(
  [
    {
      name: 'app-vue3',
      entry: '//localhost:3002',
      container: '#container',
      activeRule: '/app-vue3',
      props: {
        msg: '11111 origin main app'
      }
    }
  ]
)

// 初始化 state
const state = { count: 1 }
const actions = initGlobalState(state)
actions.onGlobalStateChange((state, prev) => {
  console.log(111111, state, prev);
})
// actions.setGlobalState(state)
// actions.offGlobalStateChange()

start()

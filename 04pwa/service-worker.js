const CACHE_NAME = 'cache_v1'

// worker 文件发生改变才会触发
// 作用：缓存内容
this.addEventListener('install', async event => {
  const cache = await caches.open(CACHE_NAME) // 开启一个cache
  await cache.addAll([ // 缓存所有静态资源
    './logo.png',
    './manifest.json',
    './web-worker.js',
    './service-worker.js',
    './index.html',
  ])

  // service worker 跳过等待，进入 activate 状态
  await this.skipWaiting()
})


// worker 被激活
// 作用：清除旧的内容
this.addEventListener('activate', async event => {
  // 判断是否存在旧的缓存 将其删掉
  const keys = await caches.keys()
  keys.forEach(key => {
    if (key !== CACHE_NAME) {
      caches.delete(key)
    }
  })

  // service worker 激活后，立即获得控制权
  await this.clients.claim()
})


// 所有数据请求触发 fetch 生命周期
// 作用：根据网络环境渲染内容
this.addEventListener('fetch', async event => {
  const req = event.request

  // 给浏览器响应
  event.respondWith(networkFirst(req))
})

// 优先网络渲染
async function networkFirst(req) {
  try {
    const fresh = await fetch(req)
    return fresh
  } catch (error) {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(req)
    return cached
  }
}

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/app-vue3/' : '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/HelloWorld.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/About.vue')
    }
  ]
})

export default router

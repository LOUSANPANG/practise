import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Gsap.vue'),
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/demo.vue'),
    },
  ],
})

export default router

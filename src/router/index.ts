import { createRouter, createWebHashHistory } from 'vue-router';

export const routes = [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
    meta: { title: '前台营业' },
  },
  {
    path: '/table',
    component: () => import('@/pages/table/index.vue'),
    meta: { title: '桌台设置' },
  },
  {
    path: '/goods',
    component: () => import('@/pages/goods/index.vue'),
    meta: { title: '商品设置' },
  },
  {
    path: '/print',
    component: () => import('@/pages/print/index.vue'),
    meta: { title: '打印设置' },
  },
  {
    path: '/data',
    component: () => import('@/pages/data/index.vue'),
    meta: { title: '数据统计' },
  },
  {
    path: '/reset',
    component: () => import('@/pages/reset.vue'),
    meta: { title: '重置软件' },
  },
  {
    path: '/:cathchAll(.*)', // 不识别的path自动匹配404
    component: () => import('@/pages/home/index.vue'),
    hidden: true,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

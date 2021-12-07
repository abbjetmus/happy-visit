
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/vote',
        component: () => import('pages/HappyVisitPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/our-orders',
        component: () => import('pages/OurOrdersPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/order',
        component: () => import('pages/OrderPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

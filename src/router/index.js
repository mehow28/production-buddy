import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '../views/TabsPage.vue'
import { useAuthStore } from '../stores/auth.store';

const routes = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  { 
    path: '/login', 
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    authRequired: true,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
        
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});

export default router

// import { createRouter, createWebHistory } from 'vue-router';

// import { useAuthStore } from '@/stores';
// import { HomeView, LoginView } from '@/views';

// export const router = createRouter({
//     history: createWebHistory(import.meta.env.BASE_URL),
//     linkActiveClass: 'active',
//     routes: [
//         { path: '/', component: HomeView },
//         { path: '/login', component: LoginView }
//     ]
// });

// router.beforeEach(async (to) => {
//     // redirect to login page if not logged in and trying to access a restricted page
//     const publicPages = ['/login'];
//     const authRequired = !publicPages.includes(to.path);
//     const auth = useAuthStore();

//     if (authRequired && !auth.user) {
//         auth.returnUrl = to.fullPath;
//         return '/login';
//     }
// });
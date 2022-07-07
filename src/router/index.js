import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView";
import SettingsView from "@/views/SettingsView";
import productRouter from "@/router/products";
import categoryRouter from "@/router/category";
import purchasesRouter from "@/router/purchases";
import salesRouter from "@/router/sales";
import salesReportRouter from "@/router/reports/sales";
import customerRouter from "@/router/customers";
import vendorsRouter from "@/router/vendors";
import store from "@/store";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta:{
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
    //Load other routes
    ...productRouter,
    ...categoryRouter,
    ...salesRouter,
    ...customerRouter,
    ...vendorsRouter,
    ...purchasesRouter,

    //Report routes
    ...salesReportRouter
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})


router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !store.state.user){
    return {
      name: 'login',
      //
    }
  }
})

export default router

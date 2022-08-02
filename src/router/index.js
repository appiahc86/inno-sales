import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from "@/views/SettingsView";
import productRouter from "@/router/products";
import categoryRouter from "@/router/category";
import purchasesRouter from "@/router/purchases";
import salesRouter from "@/router/sales";
import customerRouter from "@/router/customers";
import vendorsRouter from "@/router/vendors";
import billsRouter from "@/router/bills";
import userRouter from "@/router/users";

//Reports
import salesReportRouter from "@/router/reports/sales";
import productsReportRouter from "@/router/reports/products";
import purchasesReportRouter from "@/router/reports/purchases";

import store from "@/store";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },

    //Load other routes
    ...userRouter,
    ...productRouter,
    ...categoryRouter,
    ...salesRouter,
    ...customerRouter,
    ...vendorsRouter,
    ...purchasesRouter,
    ...billsRouter,

    //Report routes
    ...salesReportRouter,
    ...productsReportRouter,
    ...purchasesReportRouter
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

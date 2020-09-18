import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ClientsByCategory from '@/components/client/ClientsByCategory'
import ClientById from '@/components/client/ClientById'
import AllClients from '@/components/client/AllClients'
import Auth from '@/components/auth/Auth'

import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
  name: 'home',
  path: '/',
  component: Home
}, {
  name: 'adminPages',
  path: '/admin',
  component: AdminPages,
  meta: { requiresAdmin: true }
}, {
  name: 'clientsByCategory',
  path: '/categories/:id/clients',
  component: ClientsByCategory
}, {
  name: 'clientById',
  path: '/clients/:id',
  component: ClientById
}, {
  name: 'allClients',
  path: '/allClients',
  component: AllClients
}, {
  name: 'auth',
  path: '/auth',
  component: Auth
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const json = localStorage.getItem(userKey)

  if(to.matched.some(record => record.meta.requiresAdmin)) {
    const user = JSON.parse(json)
    user && user.admin ? next() : next({ path: '/' })
  }else {
    next()
  }
})

export default router
import Vue from 'vue'
import Router from 'vue-router'
const Face = () => import('@/components/Face.vue')
Vue.use(Router)

export default new Router({
   mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Face',
      component: Face
    }
  ]
})

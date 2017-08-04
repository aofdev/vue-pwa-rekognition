
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
Vue.use(Vuetify)
require('../node_modules/vuetify/dist/vuetify.min.css')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

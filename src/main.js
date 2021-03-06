import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
import './components/ef/index.css'
import config from './config'
Vue.use(VueClipboard)
Vue.use(ElementUI, {size: 'small'})

Vue.prototype.$config = config

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

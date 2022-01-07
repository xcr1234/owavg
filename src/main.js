import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './components/ef/index.css'
Vue.use(ElementUI, {size: 'small'})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

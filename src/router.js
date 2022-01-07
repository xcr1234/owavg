import Vue from 'vue'
import Router from 'vue-router'
import Test from './Test'


Vue.use(Router)


export default new Router({
  mode: 'hash',
  routes:[
    {
      path:'/',
      name:'Test',
      component:Test
    }
  ]
})

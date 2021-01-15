import Vue from 'vue'
import App from './App'
import store from './store/index'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store

const app = new Vue({
    App,
    // store, 在mpvue中，vuex对象不能注入到页面和组件当中, 解决方法：使用Vue.prototype.$store = store
}).$mount()


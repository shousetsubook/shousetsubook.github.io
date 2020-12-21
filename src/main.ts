import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import store from './store'
import { kutenkara } from './helpers/aozora'

(window as any).kutenkara = kutenkara;

Vue.config.productionTip = false;
Vue.use(Vuex);

new Vue({
  store,
  render: function (h) { return h(App) },
}).$mount('#app');
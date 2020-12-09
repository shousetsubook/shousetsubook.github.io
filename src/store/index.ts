import Vue from 'vue'
import Vuex from 'vuex'
import book from './book'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
      book,
  },
  strict: debug,
})

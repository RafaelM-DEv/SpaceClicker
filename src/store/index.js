import Vue from 'vue'
import Vuex from 'vuex'

import auth from './module-example/auth'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      auth
    },

    strict: process.env.DEBUGGING
  })

  return Store
}

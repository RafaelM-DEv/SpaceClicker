import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

import routes from './routes'

Vue.use(VueRouter)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBMzrTl2dXjff3kER_H9xuufuKZFI7iBhk',
  authDomain: 'space-clicker-oficial.firebaseapp.com',
  projectId: 'space-clicker-oficial',
  storageBucket: 'space-clicker-oficial.appspot.com',
  messagingSenderId: '381995615047',
  appId: '1:381995615047:web:713a8fae1d9928de8a8262'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}

import firebase from 'firebase/app'

const state = {
  user: {}
}

const getters = {
  user: state => state.user
}

const actions = {
  logOut ({ commit }) {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem('userClicker')
      return this.$router.replace({ name: 'login' })
    })
    const user = {}
    commit('LOG_OUT', user)
  },

  signIn ({ commit }) {
    const user = localStorage.getItem('userClicker')
    const rawuser = JSON.parse(user)
    commit('SING_IN', rawuser)
  }
}

const mutations = {
  LOG_OUT (state, user) {
    state.user = user
  },

  SING_IN (state, user) {
    state.user = user
  }
}

export default {
  namespaced: false,

  state,
  getters,
  mutations,
  actions
}

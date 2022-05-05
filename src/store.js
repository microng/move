import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://img0.baidu.com/it/u=1084375263,2539757177&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'

  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    }
  },
  actions: {

  }
})

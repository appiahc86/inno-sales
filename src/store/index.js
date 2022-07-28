import {createStore} from 'vuex'
import cartModule from "@/store/cartModule";
import purchaseCartModule from "@/store/purchaseCartModule";

export default createStore({

  state: {
    user: null,
    settings: {}
  },

                          //GETTERS
  getters: {
    user: state => state.user, //Get User
    setting: state => state.settings, //get settings
  },

                           // MUTATIONS
  mutations: {
    setUser: (state, payload) => {
      state.user = payload
    },
    setSettings: (state, payload) => {
      state.settings = payload;
    },
    logout: (state, payload) => {
      state.user = null;
    },
  },

                                //ACTIONS
  actions: {
    setUser: ({commit}, payload) => { //set user
      commit('setUser', payload);
    },

    setSettings: ({commit}, payload) => { //set company settings
      commit('setSettings', payload);
    },

    logout: ({commit}, payload) => { //this will set user to null
      commit('logout', payload);
    },

  },


  modules: {
    cartModule, purchaseCartModule
  }
})


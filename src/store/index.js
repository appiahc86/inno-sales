import {createStore} from 'vuex'
import cartModule from "@/store/cartModule";
import purchaseCartModule from "@/store/purchaseCartModule";

export default createStore({

  state: {
    user: null,
    settings: null
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
    }
  },

                                //ACTIONS
  actions: {
    setUser: ({commit}, payload) => { //set user
      commit('setUser', payload);
    },

    setSettings: ({commit}, payload) => { //set company settings
      commit('setSettings', payload);
    }
  },


  modules: {
    cartModule, purchaseCartModule
  }
})


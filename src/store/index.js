import {createStore} from 'vuex'
import cartModule from "@/store/cartModule";
import purchaseCartModule from "@/store/purchaseCartModule";
import productsModule from "@/store/productsModule";

export default createStore({

  state: {
    user: null,
    settings: {},
    freezeRouting: false
  },

                          //GETTERS
  getters: {
    user: state => state.user, //Get User
    setting: state => state.settings, //get settings
    getFreezeRoutingStatus: state => state.freezeRouting, //get freeze routing status
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
    setFreezeRouting: (state, payload) => {
      state.freezeRouting = payload;
    }
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
    setFreezeRouting: ({commit}, payload) => { // set freeze routing status
      commit('setFreezeRouting', payload);
    }
  },


  modules: {
    cartModule, purchaseCartModule, productsModule
  }
})


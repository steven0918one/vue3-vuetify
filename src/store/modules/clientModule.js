export default {
  namespaced: true,
  state() {
    return {
      clientInfo: {},
    };
  },

  getters: {
    clientInfo(state) {
      return state.clientInfo;
    }
  },

  mutations: {
    SET_CLIENT_INFO(state, payload) {
      state.clientInfo = payload;
    },
  },

  actions: {
    LogOut({ commit }) {
      commit('SET_CLIENT_INFO', null);
    }
  },
};

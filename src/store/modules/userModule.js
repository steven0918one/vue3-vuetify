export default {
  namespaced: true,
  state() {
    return {
      userInfo : {},
      role: null,
    };
  },

  getters: {
    userInfo(state) {
      return state.userInfo;
    },
    role(state) {
      return state.role
    }
  },

  mutations: {
    SET_USER_DATA(state, payload) {
      state.userInfo = payload;      
    },
    SET_USER_ROLE(state, payload) {
      state.role = payload;
    },    
  },

  actions: {
    LogOut({ commit }) {
      commit('SET_USER_DATA', null);        
      commit('SET_USER_ROLE', null);        
    }
  },
};

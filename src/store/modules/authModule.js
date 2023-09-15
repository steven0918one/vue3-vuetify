export default {
  namespaced: true,
  state() {
    return {
      userInfo: {},
      verificationCode: '',
    };
  },

  getters: {
    verificationCode(state) {
      return state.verificationCode;
    },
  },

  mutations: {
    SET_CODE(state, payload) {
      state.verificationCode = payload;
    }
  },

  actions: {
    //
  },
};

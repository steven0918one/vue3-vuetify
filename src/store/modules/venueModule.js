export default {
  namespaced: true,
  state() {
    return {
      //isEditing: false,
      venue: null,
    };
  },

  getters: {
    // isEditing(state) {
    //   return state.isEditing;
    // },
    venue(state) {
      return state.venue;
    },
  },

  mutations: {
    SET_VENUE_DATA(state, payload) {
      state.venue = payload;
      //state.isEditing = payload === false ? false : true;
    },
  },

  actions: {
    LogOut({ commit }) {
      commit('SET_VENUE_DATA', null);        
    }
  },
};

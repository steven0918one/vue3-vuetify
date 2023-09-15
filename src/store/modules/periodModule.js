export default {
    namespaced: true,
    state() {
      return {
        period: null,
      };
    },
  
    getters: {
      period(state) {
        return state.period;
      },
    },
  
    mutations: {
      SET_PERIOD(state, _period) {
        state.period = _period;
      },
    },
  
    actions: {
      LogOut({ commit }) {
        commit('SET_PERIOD', null);        
      }
    },
  };
  
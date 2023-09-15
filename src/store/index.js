import { createStore } from "vuex";
import authModule from "./modules/authModule";
import clientInfoModule from "./modules/clientModule";
import venuesModule from "@/store/modules/venueModule";
import periodModule from "@/store/modules/periodModule";
import userInfoModule from "@/store/modules/userModule";
const store = createStore({
  modules: {
    authModule,
    clientInfoModule,
    venuesModule,
    periodModule,
    userInfoModule
  }
});
export default store;

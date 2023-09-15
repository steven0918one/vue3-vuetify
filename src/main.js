// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

// store
import store from "./store";

// Crypto.js
import VueCryptojs from 'vue-cryptojs'

// Translations
import {i18n} from "@/i18n/index";

// Router
import router from "@/router";

// Astra custom scss
import "@/assets/scss/astrastyles.scss";

const app = createApp(App).use(i18n).use(store).use(router).use(VueCryptojs);
registerPlugins(app);

router.isReady().then(() => {
  app.mount('#app')
})

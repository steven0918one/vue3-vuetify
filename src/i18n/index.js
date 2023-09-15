import {createI18n} from "vue-i18n";
import en from "@/i18n/locale/en.json";
import cn from "@/i18n/locale/cn.json";

export const i18n = new createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: process.env.BASE_URL,
  fallbackLocale: 'en',
  messages: { en, cn },
  missingWarn: false,
  fallbackWarn: false,
})

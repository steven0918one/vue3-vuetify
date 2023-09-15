import {i18n} from "@/i18n"
import { nextTick } from "vue"
import {setCookie, getCookie} from "@/util/constants";

const Trans = {
  get defaultLocale() {
    return window.navigator.language;
  },

  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(",")
  },

  get currentLocale() {
    return i18n.global.locale.value
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale
  },

  async switchLanguage(newLocale) {
    await Trans.loadLocaleMessages(newLocale)
    Trans.currentLocale = newLocale
    document.querySelector("html").setAttribute("lang", newLocale)
    setCookie("user-locale", newLocale , 7);
  },

  async loadLocaleMessages(locale) {
    if(!i18n.global.availableLocales.includes(locale)) {
      const messages = await import(`../i18n/locale/${locale}.json`)
      i18n.global.setLocaleMessage(locale, messages.default)
    }

    return nextTick()
  },

  isLocaleSupported(locale) {
    return Trans.supportedLocales.includes(locale)
  },

  getUserLocale() {
    const locale = Trans.defaultLocale
    return {
      locale: locale,
      localeNoRegion: locale.split('-')[0]
    }
  },

  guessDefaultLocale() {
    const userPersistedLocale = getCookie("user-locale")
    if(userPersistedLocale) {
      return userPersistedLocale
    }

    const userPreferredLocale = Trans.getUserLocale()

    if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale
    }

    if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion
    }

    if (!Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return import.meta.env.VITE_FALLBACK_LOCALE
    }

    return Trans.defaultLocale
  },

  async routeMiddleware(to, _from, next) {
    const paramLocale = to.params.locale

    if(!Trans.isLocaleSupported(paramLocale)) {
      return next(Trans.guessDefaultLocale())
    }
    await Trans.switchLanguage(paramLocale)

    return next()
  },

  // unused yet, this is for the router-links
  i18nRoute(to) {
    return {
      ...to,
      params: {
        locale: Trans.currentLocale,
        ...to.params
      }
    }
  }
}

export default Trans

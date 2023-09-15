<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {clearCookie, getLocalStorageData} from "@/util/constants";

const { locale } = useI18n();
const router = useRouter();
const store = useStore();

// loads user data from cookies, because Vuex loses data on refresh.
// if there is no data, then user is redirected to log-in
onMounted( () => {
  const userInfo = getLocalStorageData('userInfo');
  if (!userInfo) {
    clearCookie('jwt');
     router.push({
      name: "loginLayout",
      params: { locale: locale.value },
    });
  } else {
    const jsonUserInfo = JSON.parse(userInfo);
    store.commit("userInfoModule/SET_USER_DATA", jsonUserInfo);
    store.commit("userInfoModule/SET_USER_ROLE", jsonUserInfo.role);
  }
});
</script>

<style scoped>
@import "@/assets/scss/astrastyles.scss";
</style>

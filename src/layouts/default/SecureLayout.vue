<template>
  <BaseHeader @setRail="rail = !rail"></BaseHeader>
  <BaseSidebar :rail="rail"></BaseSidebar>
  <v-main class="main">
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import BaseHeader from "@/components/base/BaseHeader.vue";
import BaseSidebar from "@/components/base/BaseSidebar.vue";
import {ref} from "vue";

let rail = ref(false);
</script>

<style lang="scss" scoped>
.main {
  background: #FBFCFC;
}
</style>

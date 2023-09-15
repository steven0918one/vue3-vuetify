<template>
    <div class="auth-layout fill-height d-flex justify-center align-center">
      <LanguageSwitcher class="lang-switcher"></LanguageSwitcher>
      <router-view />
    </div>
</template>

<script setup>
  import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
</script>

<style scoped>
.auth-layout {
  background: linear-gradient(
    90deg,
    rgba(46, 134, 137, 0.099871323529411797) 0%,
    rgba(66, 126, 197, 0.027070203081232536) 70%,
    rgba(149, 51, 122, 0.099871323529411797) 100%
  );
}
.lang-switcher {
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>

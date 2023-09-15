<template>
  <div class="pl-3">
    <v-row v-if="route.name === 'settings'">
      <v-col xs="12" sm="12" md="6" lg="auto" v-for="link in settingsLinks" :key="link.title">
        <SettingCard :title="link.title" :icon="link.icon" :route="link.route"></SettingCard>
      </v-col>
    </v-row>
    <router-view v-else></router-view>
  </div>
</template>
<script setup>
import { settingsLinks } from "@/util/navigationLinks";
import SettingCard from "@/components/settings/SettingCard.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>


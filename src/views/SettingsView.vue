<template>
  <v-card class="fill-height bg-transparent pa-3">
    <div v-if="displaySettingsHeader" class="d-flex align-center">
      <div class="d-flex flex-column">
        <v-card-title class="text-capitalize text-h5">{{route.name }}</v-card-title>
        <v-breadcrumbs v-if="breadcrumbs.length > 1" :items="breadcrumbs">
          <template v-slot:title="{ item }">
            <div class="text-body-2">{{ item.title }}</div>
          </template>
        </v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        v-if="showCreateBtn && userRole >= adminRole"
        class="align-self-end mb-2 mr-2 rounded-lg venues-btn text-center"
        color="orange"
        flat
        prepend-icon="mdi-plus"
        @click="handleBtnClick(route.name)"
      >
        <div class="text-body-2 font-weight-medium">
          {{ settingActionBtnText }}
        </div>
      </v-btn>
    </div>
    <router-view :class="{ 'mt-5': breadcrumbs.length === 1 }"></router-view>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { generateBreadcrumbs } from "@/util/constants";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { adminRole } from "@/util/constants";
import { useStore } from "vuex";

const store = useStore();
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const userRole = computed(() => store.getters["userInfoModule/role"]);
const handleBtnClick = (pageName) => {
  switch (pageName) {
    case "venues":
      router.push({ name: "create venue", params: { locale: locale.value } });
      break;
    case "users":
      router.push({ name: "invite-users", params: { locale: locale.value } });
      break;
  }
};

const breadcrumbs = computed(() => {
  return generateBreadcrumbs(route.fullPath);
});

const settingActionBtnText = computed(() => {
  return route.name === "venues"
    ? t("settings.venues.createVenue.createVenueBtn")
    : t("settings.users.inviteUsers.inviteUserBtn");
});

const showCreateBtn = computed(() => {
  return route.name === "venues" || route.name === "users";
});

const displaySettingsHeader = computed(() => {
  return (
    route.name !== "create venue" &&
    route.name !== "edit-venue" &&
    route.name !== "invite-users"
  );
});
</script>

<style scoped>
.venues-btn {
  width: 138px;
  min-height: 40px;
}
</style>

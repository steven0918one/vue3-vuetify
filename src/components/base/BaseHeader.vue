<template>
  <v-app-bar :border="true" elevation="0">
    <div class="d-flex w-100 fill-height">
      <v-row>
        <v-col class="d-flex justify-start align-center fill-height ml-5 px-0">
          <PhSquaresFour size="28" @click="emit('setRail')" class="rail-icon ml-1"/>
        </v-col>
        <v-col
          class="d-none d-sm-flex justify-center align-center fill-height pl-4"
        >
          <div class="w-25 mr-12 mr-md-0">
            <BaseLogo
              @click="
                router.push({
                  name: 'secureLayout',
                  params: { locale: locale },
                })
              "
            />
          </div>
        </v-col>
        <v-col class="d-flex justify-end align-center fill-height px-0">
          <div class="d-flex px-5 align-center pr-3">
            <div class="d-none d-md-flex">
              <v-select
                v-if="chainsList.length > 1"
                v-model="selectedChain"
                :items="chainsList"
                active
                class="chains-select mt-5 mr-4"
                density="comfortable"
                flat
                hide-selected
                variant="outlined"
              >
                <template v-slot:prepend-inner>
                  <PhForkKnife size="22" color="gray"/>
                </template>
                <template v-slot:selection="{ item }">
                  <div class="text-truncate text-capitalize">
                    {{ item.title }}
                  </div>
                </template>
              </v-select>
              <LanguageSwitcher class="mt-5" />
            </div>
            <div class="px-4">
              <v-menu class="elevation-0" location="bottom center" offset="20">
                <template v-slot:activator="{ props }">
                  <v-badge v-model="documentBadge" color="error" v-bind="props">
                    <PhFileText size="25" v-bind="props" class="rail-icon"/>
                  </v-badge>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in documentsList"
                    :key="index"
                    :value="index"
                    class="px-10"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="pl-0 pr-4">
              <v-menu location="bottom center" offset="20">
                <template v-slot:activator="{ props }">
                  <v-badge
                    v-model="notificationBadge"
                    color="error"
                    content="3"
                    v-bind="props"
                  >
                    <PhBellSimple size="25" v-bind="props" class="rail-icon"/>
                  </v-badge>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in documentsList"
                    :key="index"
                    :value="index"
                    class="px-10"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="pl-0 pr-4 d-none d-sm-block">
              <v-menu location="bottom right" offset="12">
                <template v-slot:activator="{ props }">
                  <UserAvatar :user="userInfo" v-bind="props"></UserAvatar>
                </template>
                <v-list border class="elevation-0 rounded-lg pa-0">
                  <div
                    v-for="menuItem in userProfileSettingsMenu"
                    :key="menuItem.title"
                  >
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-list-item
                          :class="
                            menuItem.route === 'logout' ? 'text-error' : ''
                          "
                          :disabled="!menuItem.route"
                          :style="isHovering ? 'background:#3CBCC108' : ''"
                          :title="menuItem.title"
                          class="pa-0 pl-1 user-settings-menu-item"
                          v-bind="props"
                          @click="handleUserSettingsMenuClick(menuItem.route)"
                        >
                          <template v-slot:prepend>
                            <v-icon :icon="menuItem.icon" class="mx-2"></v-icon>
                          </template>
                        </v-list-item>
                      </template>
                    </v-hover>
                  </div>
                </v-list>
              </v-menu>
            </div>

            <!-- START -VISIBLE ONLY ON RESPONSIVE - USER MENU -->
            <div class="pl-0 pr-4 d-block d-sm-none">
              <v-dialog
                v-model="userSettingsDialog"
                class="block pa-0 ma-0 ml-auto profile-modal h-100"
                fullscreen
                scrollable
                transition="slide-x-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-avatar class="mb-2" color="red" v-bind="props">
                    <v-btn class="text-body-2 font-weight-medium">CJ</v-btn>
                  </v-avatar>
                </template>
                <v-list class="fill-height resp-dialog-list">
                  <v-icon
                    class="pl-6"
                    color="dark"
                    icon="mdi-arrow-left"
                    @click="userSettingsDialog = false"
                  ></v-icon>
                  <v-list-item>
                    <v-select
                      v-if="chainsList.length > 1"
                      v-model="selectedChain"
                      :items="chainsList"
                      active
                      class="chains-select mt-5 mr-4"
                      density="comfortable"
                      flat
                      hide-selected
                      variant="outlined"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-silverware-fork-knife</v-icon>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="text-truncate text-capitalize">
                          {{ item.title }}
                        </div>
                      </template>
                    </v-select>
                  </v-list-item>
                  <v-list-item>
                    <LanguageSwitcher />
                  </v-list-item>
                  <v-list-item
                    :title="userProfileSettingsMenu[4].title"
                    class="user-settings-menu-item pt-4 text-error"
                    @click="
                      handleUserSettingsMenuClick(
                        userProfileSettingsMenu[4].route
                      )
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon
                        :icon="userProfileSettingsMenu[4].icon"
                        class="mx-2"
                      ></v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-dialog>
            </div>
            <!-- END - VISIBLE ONLY ON RESPONSIVE - USER MENU -->
          </div>
        </v-col>
      </v-row>
    </div>
  </v-app-bar>
</template>

<script setup>
import { userProfileSettingsMenu } from "@/util/navigationLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import UserAvatar from "@/components/settings/users/UserAvatar.vue";
import BaseLogo from "@/components/base/BaseLogo.vue";

import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { clearCookie } from "@/util/constants";
import { useStore } from "vuex";
import { getClientInfo } from "@/services/clientRoutes.api";
import {PhSquaresFour, PhForkKnife, PhFileText, PhBellSimple} from "@phosphor-icons/vue";

const emit = defineEmits(["setRail"]);

const { t, locale } = useI18n();

const store = useStore();

const userInfo = computed(() => store.getters[`userInfoModule/userInfo`]);

const router = useRouter();

const documentsList = ref(["doc1", "doc1", "doc1", "doc1"]);
const chainsList = ref([]);
let selectedChain = ref(null);

const documentBadge = ref(false);
const notificationBadge = ref(false);
const handleUserSettingsMenuClick = (route) => {
  switch (route) {
    case "logout":
      clearCookie("jwt");
      clearCookie("user-locale");      
      store.dispatch('venueModule/LogOut');
      store.dispatch('userInfoModule/LogOut');
      store.dispatch('clientInfoModule/LogOut');      
      router.push({ name: "login", params: { locale: locale.value } });
      break;
    case "settings":
      router.push({ name: "settings", params: { locale: locale.value } });
      break;
    case "etc":
      //
      break;
    default:
      console.log(route, "error");
  }
};

// opens user settings menu on mobile view
const userSettingsDialog = ref(false);

onMounted(async () => {
  try {
    const response = await getClientInfo();
    if (response.data.success === true) {
      chainsList.value = response.data.value.chains;
      selectedChain.value = chainsList.value[0];
    }
  } catch (e) {
    console.log(e);
  }
});
</script>

<style lang="scss" scoped>
.chains-select {
  min-width: 200px;
  width: 100%;
}

.v-select-custom {
  min-width: 170px;
}

.user-settings-menu-item {
  border-bottom: 1px solid #e8e9ea;
  min-width: 240px;
  max-width: 240px;
  width: 100%;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
}

.profile-modal {
  max-width: 350px;
  width: 100%;
}

.resp-dialog-list {
  background: #fbfcfc;
}

.rail-icon {
  &:hover {
    color: #3CBCC1;
    cursor: pointer;
  }
}
</style>

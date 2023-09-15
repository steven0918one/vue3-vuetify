<template>
  <v-navigation-drawer
    :rail="props.rail"
    color="astraBg"
    disable-resize-watcher
    permanent
    rail-width="60"
  >
    <v-list class="py-5" nav>
      <v-list-item-subtitle
        v-if="user && user.client && user.client.name"
        class="px-2 pb-4 text-capitalize font-weight-bold"
        >{{ user.client.name }}
      </v-list-item-subtitle>
      <div v-for="navLink in navigationLinks" :key="navLink.title">
        <router-link
          v-if="navLink.children.length === 0"
          :to="{ name: navLink.route, params: { locale: locale } }"
          class="list-item"
        >
          <v-list-item
            active-class="list-item-active"
            active-color="astraActiveNav"
            class="rounded-lg"
            @click="handleNavLinkClick(navLink.route)"
          >
            <template v-slot:prepend>
              <PhPresentationChart
                :class="!props.rail ? 'mr-2' : 'pl-0'"
                :size="22"
              />
            </template>
            <v-list-item-title
              :class="props.rail ? 'd-none' : ''"
              class="font-weight-regular text-body-2"
              >{{ t("navigation." + [navLink.title] + ".title") }}
            </v-list-item-title>
          </v-list-item>
        </router-link>
        <v-list-group v-else class="my-3">
          <template v-slot:activator="{ props, isOpen }">
            <router-link
              :to="{ name: navLink.route, params: { locale: locale } }"
              class="list-item"
            >
              <v-list-item
                :variant="isOpen ? 'outlined' : 'default'"
                class="rounded-lg"
                v-bind="props"
              >
                <template v-slot:prepend>
                  <PhGearSix :class="!props.rail ? 'mr-2' : 'pl-2'" size="22" />
                </template>
                <v-list-item-title
                  :class="props.rail ? 'd-none' : ''"
                  class="font-weight-regular text-body-2"
                  >{{ t("navigation." + [navLink.title] + ".title") }}
                </v-list-item-title>
              </v-list-item>
            </router-link>
          </template>
          <v-list-item
            v-for="subLink in navLink.children"
            :key="subLink.title"
            @click="handleNavLinkClick(subLink.route)"
          >
            {{
              t(
                "navigation." +
                  navLink.title +
                  ".subLinks." +
                  subLink.title +
                  ".title"
              )
            }}
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { navigationLinks } from "@/util/navigationLinks";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { onMounted, computed } from "vue";
import { PhPresentationChart, PhGearSix } from "@phosphor-icons/vue";
import { useStore } from "vuex";

const store = useStore();

const user = computed(() => store.getters["userInfoModule/userInfo"]);

const props = defineProps({
  rail: {
    default: false,
  },
});

const router = useRouter();
const { t, locale } = useI18n();

const handleNavLinkClick = (route) => {
  router.push({ name: route, params: { locale: locale.value } });
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.navlink-item-active {
  display: block;
  text-decoration: none;
  border-radius: 8px;
  background: #3cbcc108;
  border: 1px solid #3cbcc1 !important;
  color: #3cbcc1 !important;
}

.list-item {
  cursor: pointer;
  display: block;
  color: inherit;
  border: 1px solid transparent;
  border-radius: 8px;
  text-decoration: none;
  width: 100%;

  &:hover {
    background: #3cbcc108;
    border: 1px solid #3cbcc1;
    color: #3cbcc1;
    transition: all 300ms;
  }
}

.v-list-item--active {
  border: none;
}
</style>

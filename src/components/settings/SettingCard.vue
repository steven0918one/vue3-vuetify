<template>
  <v-card class="setting-card bg-white d-flex align-center rounded-lg" @click="handleSettingsCardClick(props.route)" hover>
    <v-card-item class="pr-3">
      <v-avatar class="rounded-lg avatar pr-0" border>
        <v-icon color="primaryLight" class="pr-0" :icon="props.icon"></v-icon>
      </v-avatar>
    </v-card-item>
    <v-card-title class="text-body-1 pl-0 text-capitalize">{{ props.title }}</v-card-title>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-arrow-right" color="astraGray" class="settings-card-arrow mr-5"></v-icon>
  </v-card>
</template>

<script setup>
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true
  }
});

const {t, locale} = useI18n();

const router = useRouter();

const handleSettingsCardClick = (route) => {
  router.push({name : route, params : { locale : locale.value}})
}
</script>

<style scoped lang="scss">
.settings-card-arrow {
  position: relative;
  left: 0;
  transition: all 200ms;
}
.setting-card {
  max-width: 390px;
  min-width: 350px;
  width: 100%;
  border: 1px solid #2E86891A;
  box-shadow: 3px 5px 10px 0px #2A838708;
  min-height: 96px;
  cursor: pointer;
  background: white !important;
  &:hover {
    background: white !important;
  .settings-card-arrow {
    position: relative;
    left: 7px;
    transition: all 200ms;
  }
  }
}

</style>

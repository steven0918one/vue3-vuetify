<template>
  <v-card v-if="!isLoadingData" flat class="ma-2 mt-5">
    <div
      v-if="userPeriod && userPeriod.length > 0"
      class="pa-2 rounded-xl radio-container"
    >
      <v-tabs
        v-model="section"
        bg-color="transparent"
        color="basil"
        centered
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab"
          :value="tab"
          @click="setSection"
        >
          {{ t('settings.period.sections.' + tab) }}
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-container fluid>
        <v-radio-group v-model="currentPeriod">
          <v-row>
            <v-col
              v-for="item in userPeriod"
              :key="item.key"
              cols="12"
              sm="6"
              md="6"
            >
              <v-radio
                :name=item.key
                :label="$t(`settings.period.keys.${item.shortkey}`)"
                :value=item.key
                @change="setPeriod"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <div class="py-5 d-flex justify-center w-100">
          <v-btn
            class="action-btn rounded-lg mx-3"
            color="error"
            variant="outlined"
            @click="router.go(-1)"
            >{{ $t("settings.venues.createVenue.discardBtn") }}
          </v-btn>
          <v-btn
            :disabled="!changedPeriod"
            class="action-btn rounded-lg mx-3"
            color="primaryLight"
            variant="flat"
            @click="savePeriod"
          >
            <div class="text-white">
              {{ $t("settings.period.saveBtn") }}
            </div>
          </v-btn>
        </div>
      </v-card-actions>
    </div>
    <div v-else class="text-body-1 px-2 fill-height">{{ $t("settings.period.noperiod") }}</div>
  </v-card>
  <div v-else class="fill-height d-flex justify-center align-center">
    <v-progress-circular
      color="white"
      indeterminate
      size="30"
      width="2"
    ></v-progress-circular>
  </div>
  <v-alert
    v-model="periodSaved"
    class="my-5"
    closable
    :type=alertType
    location="top"
    min-width="320px"
    position="absolute"
    transition="fade-transition"
  >
    <template v-slot:text>
      {{ t("settings.period.alert." + alertType) }}
    </template>
  </v-alert>
</template>

<script setup>
import { onBeforeMount, ref, computed, watch, reactive} from "vue";
import { editPeriod } from "@/services/periodRoutes.api";
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {userPeriod} from "@/util/constants";

const {t, locale} = useI18n();

const store = useStore();
const router = useRouter();

const userInfo = computed(() => store.getters['userInfoModule/userInfo']);
const tabs = [ "sale", "labour", "social", "inventory"];

let isLoadingData = ref(true);
let periodSaved = ref(false);
let alertType = ref('success');
let section = ref('sale');
let periodInfo = reactive({...userInfo.value.settings});
let currentPeriod = ref('');
let changedPeriod = ref(false);

const setSection = () => {
  currentPeriod.value = periodInfo && periodInfo[section.value] && periodInfo[section.value].period ? periodInfo[section.value].period : '';
}

const setPeriod = () => {
  periodInfo[section.value] = { period: currentPeriod.value};
}

const checkPeriod = () => {
  const keys1 = Object.keys(periodInfo);
  if (!userInfo || !userInfo.value || !userInfo.value.settings) return true;
  const keys2 = Object.keys(userInfo.value.settings);

  if (keys1.length !== keys2.length) {
    return true;
  }

  for (let key of keys1) {
    if (!userInfo.value.settings[key]) return true;
    if (userInfo.value.settings[key].period !== periodInfo[key].period) return true;
  }

  return false;
}

const changeUserInfoData = (pData) => {
  for (const el of pData) {
    if (!userInfo.value['settings']) userInfo.value['settings'] = {};
    if (!userInfo.value['settings'][el.section]) userInfo.value['settings'][el.section] = {};
    userInfo.value['settings'][el.section]['period'] = el.value;
  }
  // remove undefined element in settings of user info
  delete userInfo.value['settings']['undefined'];
  store.commit('userInfoModule/SET_USER_DATA', userInfo.value);
}

const savePeriod = async () => {
  let result = Object.keys(periodInfo).map((key) => {
    if (key != 'undefined') {
      return { section: key, value: periodInfo[key].period }
    }
  });
  // remove undifined element
  result = result.filter(function( element ) {
    return element !== undefined;
  });
  // store period
  // store.commit('periodModule/SET_PERIOD', result);
  // update userInfo settings with period
  changeUserInfoData(result);
  // postdata for period
  const data = {
      type: "period",
      sections: result
  };
  const response = await editPeriod(JSON.stringify(data));
  if (response.data.success) {
    periodSaved.value = true;
    alertType.value = 'success';
    setTimeout(async () => {
      periodSaved.value = false;
      await router.push({ name:'settings' });
    }, 1000);
  } else {
    periodSaved.value = true;
    alertType.value = 'error';
    setTimeout(async () => {
      periodSaved.value = false;
    }, 1000);
  }
}

onBeforeMount( () => {
  currentPeriod.value = periodInfo && periodInfo[section.value] && periodInfo[section.value].period ? periodInfo[section.value].period : '';
  isLoadingData.value = false;
});

watch(periodInfo, () => {
  changedPeriod.value = checkPeriod();
});
</script>

<style lang="scss" scoped>
.radio-container {
  border: 1px solid #f1f1f1;
}

.action-btn {
  cursor: pointer;
  min-width: 103px;
  min-height: 50px;
}

</style>

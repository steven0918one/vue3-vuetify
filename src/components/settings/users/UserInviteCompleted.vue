<template>
  <v-card
    class="w-100 elevation-0 rounded-xl py-5 px-5 mx-4 mx--md-0 py-md-16 px-md-16 reg-form-wrapper"
    transition="slide-x-reverse-transition"
  >
    <baseLogo />
    <div class="text-h4 pt-10 text-center font-weight-bold text-astraDark">
      {{ $t("auth.step3.title") }}!
    </div>
    <div
      v-if="query && query.client && query.firstName && query.lastName"
      class="body-1 pt-2 text-center text-astraGray d-flex justify-center flex-wrap">
      <div class="font-weight-bold pr-1">{{ query.firstName }} {{ query.lastName }}</div>
      {{$t('settings.users.inviteUsers.invitationText')}}
      <div class="font-weight-bold pl-1">{{ query.client }}.</div>
      <div class="body-1 block pl-1">
        {{$t('settings.users.inviteUsers.setPassword')}}

      </div>
    </div>
    <v-form ref="form" v-model="formValid">
      <v-row class="pt-8 d-flex flex-column align-center">
        <v-col class="py-1" cols="8">
          <v-text-field
            v-model="userInfo.password"
            :label="$t('auth.step3.passwordField')"
            :rules="[rules.required, rules.passwordRules]"
            :type="showPassword1 ? 'text' : 'password'"
            persistent-hint
          >
            <template v-slot:append-inner>
              <v-icon
                :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                color="astraGray"
                size="20"
                @click="showPassword1 = !showPassword1"
              ></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col class="py-1 pt-3" cols="8">
          <v-text-field
            v-model="userInfo.confirmPassword"
            :label="$t('auth.step3.passwordRepeatField')"
            :rules="[rules.required, rules.sameAs]"
            :type="showPassword2 ? 'text' : 'password'"
          >
            <template v-slot:append-inner>
              <v-icon
                :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                color="astraGray"
                size="20"
                @click="showPassword2 = !showPassword2"
              ></v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    <div class="body-1 pt-2 text-astraGray mr-2 h-100 d-flex justify-center">
      <v-dialog
        v-model="dialog"
        class="block pa-0 ma-0 ml-auto terms-modal h-100"
        fullscreen
        scrollable
        transition="slide-x-transition"
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <div clas="w-50 mx-auto">
          <v-checkbox
            v-model="userInfo.terms"
            class="terms-checkbox mx-auto w-100"
            color="primary"
            focused
            :rules="[rules.required]"
          >
            <template v-slot:label>
              <div>
                {{ $t('auth.step1.termsText') }}
                <a
                  class="body-1 pl-1 text-primary log-in-link font-weight-medium text-decoration-none"
                  href="#!"
                  v-bind="props"
                  @click.prevent
                >
                  {{ $t('auth.step1.termsLink') }}
                </a>
              </div>
            </template>
          </v-checkbox>

          </div>
        </template>
        <v-card>
          <v-card class="d-flex align-center px-4 py-2" color="#FBFCFC" flat>
            <v-icon
              color="dark"
              icon="mdi-arrow-left"
              @click="dialog = false"
            ></v-icon>
            <v-card-title class="px-3 text-h6">{{ $t('terms.title') }}</v-card-title>
          </v-card>
          <v-divider class="border-opacity-20"></v-divider>
          <v-card-item>
            <div class="text-body-1 text-astraLightGray font-weight-medium" color="">{{ $t('terms.subtitle') }}</div>
            <v-card-text class="text-body-2 px-0 py-1 text-astraGray terms-text">{{ $t('terms.text') }}</v-card-text>
          </v-card-item>
        </v-card>
      </v-dialog>
    </div>
    </v-form>

    <v-row class="d-flex flex-column align-center mt-2">
      <v-col cols="8">
        <div
          v-if="passwordError"
          class="d-flex flex-row justify-center align-center text-subtitle-2 text-center pb-5 text-error"
        >
          <v-icon
            class="pr-2"
            color="dark"
            icon="mdi-alert-circle-outline"
          ></v-icon>
          {{ $t("auth.step3.setPasswordError") }}
        </div>
        <v-btn
          :disabled="!formValid"
          :loading="setPasswordLoading"
          block
          class="rounded-lg"
          color="primaryLight"
          size="x-large"
          variant="flat"
          @click="submitForm"
        >
          <div class="text-white text-capitalize">
            {{ $t("auth.step3.button") }}
          </div>
          <template v-slot:append>
            <v-icon color="white" icon="mdi-arrow-right"></v-icon>
          </template>
          <template v-slot:loader>
            <v-progress-circular
              color="white"
              indeterminate
              size="30"
              width="2"
            ></v-progress-circular>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
  <v-alert
    v-model="passwordErrors"
    class="my-5"
    closable
    color="error"
    location="top"
    min-width="320px"
    position="absolute"
    transition="fade-transition"
  >
    <template v-slot:text>
      <ul>
        <li v-for="(error, idx) in passwordErrors" :key="{ idx }">
          {{ t("auth.step3.errors." + error) }}
        </li>
      </ul>
    </template>
  </v-alert>
</template>

<script setup>
import {ref, reactive, onMounted, onBeforeMount} from "vue";
import { CheckPassword, sameAs } from "@/util/constants";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import {finishInvitedUserRegistration} from "@/services/usersRoutes.api";
import { useI18n } from "vue-i18n";
import { inject } from "vue";
import BaseLogo from "@/components/base/BaseLogo.vue";

const { t, locale } = useI18n();

const store = useStore();
const router = useRouter();
const route = useRoute();

const cryoptojs = inject("cryptojs");

const dialog = ref(false);

let showPassword1 = ref(false);
let showPassword2 = ref(false);

let query = reactive({});

let formValid = ref(false);
const form = ref();

let setPasswordLoading = ref(false);

let userInfo = reactive({
  terms: false,
  password: "",
  confirmPassword: "",
});
let passwordErrors = ref(false);

onBeforeMount(() => {

  if (Object.keys(route.query).length === 0) {
  }
})
onMounted(async () => {
  query = route.query;
});
const rules = {
  required: (value) => !!value || t("auth.validations.required"),
  passwordRules: (value) =>
    CheckPassword(value) || t("auth.validations.checkPassword"),
  sameAs: (value) =>
    sameAs(userInfo.password, value) || t("auth.validations.confirmEmail"),
};

const submitForm = async () => {
  setPasswordLoading.value = true;

  await form.value.validate();
  if (form.value.modelValue === true) {
    const data = {
      code: query.code,
      terms: userInfo.terms === true ? 1 : 0,
      password: cryoptojs.MD5(userInfo.password).toString(),
    };
    try {
      const response = await finishInvitedUserRegistration(data);
      if (response.data.success === true) {
        await store.commit("userInfoModule/SET_USER_DATA", null);
        await router.push({ name: "login", params: { locale: locale.value } });
      } else {
        passwordErrors.value = response.data.error;
        setPasswordLoading.value = false;
        setTimeout(() => {
          passwordErrors.value = false;
        }, 5000);
      }
    } catch (e) {
      setPasswordLoading.value = false;
      console.log(e);
    }
  }
  setPasswordLoading.value = false;
};
</script>

<style scoped>
.reg-form-wrapper {
  max-width: 568px;
  width: 100%;
  box-shadow: 3px 5px 10px 0px rgba(42, 131, 135, 0.03) !important;
}
.terms-modal {
  max-width: 768px;
  width: 100%;
}
:deep(.terms-checkbox .v-label) {
  opacity: 1;
}
</style>

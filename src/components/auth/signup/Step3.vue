<template>
  <v-card
    class="w-100 elevation-0 rounded-xl py-5 px-5 mx-4 mx--md-0 py-md-16 px-md-16 reg-form-wrapper"
    transition="slide-x-reverse-transition"
  >
    <baseLogo/>
    <div v-if="user && user.firstName" class="text-h4 pt-10 text-center font-weight-bold text-astraDark">
      {{ $t('auth.step3.title') }} {{ user.firstName }}!
    </div>
    <div
      class="body-1 pt-2 text-center text-astraGray d-flex justify-center flex-column"
    >
      {{ $t('auth.step3.subtitle') }}
      <div v-if="user && user.email" class="body-1 block pl-1 text-astraDarkGray font-weight-medium">
        {{ user.email }}
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
          </template
          >
        </v-text-field>
      </v-col>
      <v-col class="py-1 pt-3" cols="8">
        <v-text-field
          :label="$t('auth.step3.passwordRepeatField')"
          :type="showPassword2 ? 'text' : 'password'"
          v-model="userInfo.confirmPassword"
          :rules="[rules.required, rules.sameAs]"
        >
          <template v-slot:append-inner>
            <v-icon
              :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
              color="astraGray"
              size="20"
              @click="showPassword2 = !showPassword2"
            ></v-icon>
          </template
          >
        </v-text-field>
      </v-col>
    </v-row>
    </v-form>
    <v-row class="d-flex flex-column align-center mt-2">
      <v-col cols="8">
        <div v-if="passwordError" class="d-flex flex-row justify-center align-center text-subtitle-2 text-center pb-5 text-error">
          <v-icon
            color="dark"
            icon="mdi-alert-circle-outline"
            class="pr-2"
          ></v-icon>
          {{ $t('auth.step3.setPasswordError') }}
        </div>
        <v-btn
          :loading="setPasswordLoading"
          block
          class="rounded-lg"
          color="primaryLight"
          size="x-large"
          variant="flat"
          @click="submitForm"
          :disabled="!formValid"
        >
          <div class="text-white text-capitalize">{{ $t('auth.step3.button') }}</div>
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
  <v-alert class="my-5" closable v-model="passwordErrors" transition="fade-transition" color="error" position="absolute" location="top" min-width="320px">
    <template v-slot:text>
      <ul>
        <li v-for="(error,idx) in passwordErrors" :key={idx}>
          {{t("auth.step3.errors."+error)}}
        </li>
      </ul>
    </template>
  </v-alert>
</template>

<script setup>
import {computed, ref, watch, reactive, onMounted} from "vue";
import {CheckPassword, sameAs} from "@/util/constants";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import {signupSetPassword, forgotChangePassword} from "@/services/auth.api";
import { useI18n } from 'vue-i18n';
import { inject } from 'vue'
import BaseLogo from "@/components/base/BaseLogo.vue";
const { t, locale } = useI18n();

const store = useStore();
const router = useRouter();
const route = useRoute();

const cryoptojs = inject('cryptojs');

const user = computed(() => store.getters["userInfoModule/userInfo"]);

let showPassword1 = ref(false);
let showPassword2 = ref(false);

const verificationCode = computed(() => store.getters['authModule/verificationCode']);

let formValid = ref(false);
const form = ref();

let setPasswordLoading = ref(false);

let userInfo = reactive({
    password: "",
    confirmPassword: ""
})
let passwordErrors = ref(false);

const rules = {
  required: (value) => !!value ||  t("auth.validations.checkPassword"),
  passwordRules: (value) =>
  CheckPassword(value) || t("auth.validations.checkPassword"),
  sameAs: (value) => sameAs(userInfo.password, value) || t("auth.validations.confirmEmail"),
};

const submitForm = async () => {
  setPasswordLoading.value = true;

  await form.value.validate();
  if (form.value.modelValue === true) {
    const data = {
      email: user.value.email,
      code: verificationCode.value,
      password: cryoptojs.MD5(userInfo.password).toString()
    }
    try {
      let response;
      if (route.name === 'setpassword') {
        response = await forgotChangePassword(data);
      } else {
        response = await signupSetPassword(data);
      }
      if ( response.data.success === true) {
        await store.commit('userInfoModule/SET_USER_DATA', null);
        await router.push({name :'login', params: { locale: locale.value }})
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
}
watch(userInfo, () => {
  setTimeout(() => {
    formValid.value = form.value.errors.length === 0;
  }, 100)
})

</script>

<style scoped>

.reg-form-wrapper {
  max-width: 568px;
  width: 100%;
  box-shadow: 3px 5px 10px 0px rgba(42, 131, 135, 0.03) !important;
}

</style>

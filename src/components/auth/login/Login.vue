<template>
  <v-card class="w-100 elevation-0 rounded-xl py-5 px-5 mx-4 mx--md-0 py-md-10 px-md-10 reg-form-wrapper"
          transition="slide-x-reverse-transition">
    <BaseLogo/>
    <div class="text-h4 pt-10 text-center font-weight-bold text-astraDark">
      {{ $t('auth.login.title') }}
    </div>
    <div class="body-1 pt-2 text-center text-astraGray d-flex justify-center flex-column flex-sm-row">
      {{ $t('auth.login.subtitle') }}
      <router-link class="body-1 pl-1 text-primary log-in-link font-weight-medium" to="signup">
        {{ $t('auth.login.loginLink') }}
      </router-link>
    </div>
    <v-form ref="form" v-model="formValid" @keydown.enter="submitForm">
      <v-row class="pt-8 d-flex flex-column align-center">
        <v-col class="py-2" cols="12">
          <v-text-field v-model="formData.email" :label="$t('auth.login.emailField')"
                        :rules="[rules.required, rules.email]"></v-text-field>
        </v-col>
        <v-col class="py-2" cols="12">
          <v-text-field
            v-model="formData.password"
            :label="$t('auth.login.passwordField')"
            :rules="[rules.required]"
            :type="showPassword ? 'text' : 'password'"
            persistent-hint
          >
            <template v-slot:append-inner>
              <v-icon
                :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                color="astraGray"
                size="20"
                @click="showPassword = !showPassword"
              ></v-icon>
            </template
            >
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div class="d-flex justify-space-between align-center">
      <div class="body-1">
        <v-checkbox :label="t('auth.login.keepLogged')" color="primary" hide-details></v-checkbox>
      </div>
      <div class="body-1">
        <router-link class="log-in-link text-primary font-weight-medium" to="forgot">
          {{ t('auth.login.forgetPasswordBtn') }}
        </router-link>
      </div>
    </div>
    <v-btn
      :disabled="!formValid"
      :loading="loading"
      block
      class="rounded-lg mt-7"
      color="primaryLight"
      size="x-large"
      variant="flat"
      @click="submitForm"
    >
      <div class="text-white text-capitalize">{{ $t('auth.login.loginBtn') }}</div>
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
  </v-card>
  <v-alert v-model="fieldErrors" class="my-5" closable color="error" location="top" min-width="320px"
           position="absolute" transition="fade-transition">
    <template v-slot:text>
      <ul>
        <li v-for="(error,idx) in fieldErrors" :key={idx}>
          {{ t("auth.login.errors." + error) }}
        </li>
      </ul>
    </template>
  </v-alert>
</template>

<script setup>
import {ref, reactive, watch} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {login} from "@/services/auth.api";
import {CheckEmail, sameAs, checkNumbers} from "@/util/constants";
import {useI18n} from 'vue-i18n';
import {inject} from 'vue';
import {setCookie, setLocalStorageData} from "@/util/constants";
import BaseLogo from "@/components/base/BaseLogo.vue";

const {t, locale} = useI18n();
const cryoptojs = inject('cryptojs');

const router = useRouter();
const store = useStore();

const form = ref(null);
let formValid = ref(false);
let fieldErrors = ref(false);

let showPassword = ref(false);

let loading = ref(false);

const rules = {
  required: (value) => !!value || t("auth.validations.required"),
  email: (value) => CheckEmail(value) || t("auth.validations.email"),
  sameAs: (value) => sameAs(formData.email, value) || t("auth.validations.confirmEmail"),
  onlyNumbers: (value) => checkNumbers(value) || t("auth.validations.checkNumbers"),
};

let formData = reactive({
  email: "",
  password: "",
});

const checkFormdataValues = (params) => {
  let isFilled = true;
  for (const param in params) {
    if (!params[param] || params[param] === '') isFilled = false;
  }
  return isFilled;
};

const submitForm = async () => {
  loading.value = true;

  await form.value.validate();
  if (form.value.modelValue === true) {
    try {
      const userInfo = {
        email : formData.email,
        password: cryoptojs.MD5(formData.password).toString()
      }

      const response = await login(JSON.stringify(userInfo));
      if (response.data.success) {
        await setLocalStorageData("userInfo", JSON.stringify(response.data.value.user), 1);
        setCookie("jwt", response.data.value.token, 1);
        store.commit("userInfoModule/SET_USER_DATA", response.data.value.user);
        store.commit("userInfoModule/SET_USER_ROLE", response.data.value.user.role);
        if (response.data.value.user.venues.length > 0) {
          await router.push({name: 'secureLayout', params: {locale: locale.value}})
        } else {
          await router.push({name: 'create venue', params: {locale: locale.value}});
        }
      } else {
        fieldErrors.value = response.data.error;
        loading.value = false;
        setTimeout(() => {
          fieldErrors.value = false;
        }, 5000);
      }
      loading.value = false;
    } catch (e) {
      loading.value = false;
      console.log(e)
    }
  }
  loading.value = false;
};

watch(formData, () => {
  const isAllFilled = checkFormdataValues(formData);
  setTimeout(() => {
    formValid.value = isAllFilled === true && form.value.errors.length === 0;
  }, 100);
})
</script>

<style scoped>
.log-in-link {
  cursor: pointer;
  text-decoration: none;
}

.reg-form-wrapper {
  max-width: 480px;
  width: 100%;
  box-shadow: 3px 5px 10px 0px rgba(42, 131, 135, 0.03) !important;
}

:deep(.terms-checkbox .v-label) {
  opacity: 1;
}

.terms-modal {
  max-width: 768px;
  width: 100%;
}

.terms-text {
  letter-spacing: normal !important;
}
</style>

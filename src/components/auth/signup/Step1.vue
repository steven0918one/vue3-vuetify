<template>
  <v-card class="mx-4 elevation-0 rounded-xl py-10 px-10 py-md-16 px-md-16 reg-form-wrapper"
          transition="slide-x-reverse-transition">
    <baseLogo/>
    <div class="text-h4 pt-10 text-center font-weight-bold text-astraDark">
      {{ $t('auth.step1.letsGetStarted') }}
    </div>
    <div class="body-1 pt-2 text-center text-astraGray d-flex justify-center flex-column flex-sm-row">
      {{ $t('auth.step1.createAccountText') }}
      <router-link to="login" class="body-1 pl-1 text-primary log-in-link font-weight-medium">
        {{ $t('auth.step1.loginBtn') }}
      </router-link>
    </div>
    <v-form ref="form" v-model="formValid">
      <v-row class="pt-8">
        <v-col class="py-2 pl-md-5" cols="12" md="6">
          <v-text-field :label="$t('auth.step1.firstName')" v-model="formData.firstName" :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col class="py-2 pr-md-5" cols="12" md="6">
          <v-text-field :label="$t('auth.step1.lastName')" v-model="formData.lastName" :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col class="py-2 pl-md-5" cols="12" md="6">
          <v-text-field :label="$t('auth.step1.companyName')" v-model="formData.name" :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col class="py-2 pr-md-5" cols="12" md="6">
          <v-text-field type="number" :label="$t('auth.step1.phone')" v-model="formData.phone" :rules="[rules.required, rules.onlyNumbers]"></v-text-field>
        </v-col>
        <v-col class="py-2 pl-md-5" cols="12" md="6">
          <v-text-field type="email" :label="$t('auth.step1.email')" v-model="formData.email" :rules="[rules.required, rules.email]"></v-text-field>
        </v-col>
        <v-col class="py-2 pr-md-5" cols="12" md="6">
          <v-text-field type="email" :label="$t('auth.step1.confirmEmail')" v-model="formData.confirmEmail" :rules="[rules.required, rules.sameAs]"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div class="body-1 pt-2 text-astraGray mr-2 h-100">
      <v-dialog
        v-model="dialog"
        class="block pa-0 ma-0 ml-auto terms-modal h-100"
        fullscreen
        scrollable
        transition="slide-x-transition"
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-checkbox
            v-model="formData.terms"
            class="terms-checkbox "
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
    <v-btn
      :loading="loading"
      block
      class="rounded-lg mt-3"
      color="primaryLight"
      size="x-large"
      variant="flat"
      @click="submitForm"
      :disabled="!formValid"
    >
      <div class="text-white text-capitalize">{{ $t('auth.step1.signupBtn') }}</div>
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
  <v-alert class="my-5" closable v-model="fieldErrors" transition="fade-transition" color="error" position="absolute" location="top" min-width="320px">
    <template v-slot:text>
      <ul>
        <li v-for="(error,idx) in fieldErrors" :key={idx}>
          {{t("auth.step1.errors."+error)}}
        </li>
      </ul>
    </template>
  </v-alert>
</template>

<script setup>
import {ref, reactive, watch} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter } from "vue-router";
import { signupGetStarted } from "@/services/auth.api";
import {CheckEmail, sameAs, checkNumbers} from "@/util/constants";
import { useI18n } from 'vue-i18n';
import {checkFormdataValues} from "@/util/constants";

const { t ,locale } = useI18n();
import BaseLogo from "@/components/base/BaseLogo.vue";


const emit = defineEmits(['verifyEmail'])

const router = useRouter();
const route = useRoute();
const store = useStore();


const form = ref(null);
let formValid = ref(false);
let fieldErrors = ref(false);


let dialog = ref(false);

let loading = ref(false);

const rules = {
  required: (value) => !!value || t("auth.validations.required"),
  email: (value) => CheckEmail(value) || t("auth.validations.email"),
  sameAs: (value) => sameAs(formData.email, value) || t("auth.validations.confirmEmail"),
  onlyNumbers: (value) => checkNumbers(value) || t("auth.validations.checkNumbers"),
};

let formData = reactive({
  email : "",
  name : "",
  firstName : "",
  lastName : "",
  phone: null,
  lang: route.params.locale,
  terms: false,
  confirmEmail: "",
});

const submitForm = async () => {
  loading.value = true;

  await form.value.validate();
  if (form.value.modelValue === true) {
    try {
      formData.terms = 1;
      const response = await signupGetStarted(JSON.stringify(formData));
      if (response.data.success) {
        await store.commit('userInfoModule/SET_USER_DATA', formData);
        emit("verifyEmail");
        await router.push({name : 'signupStep2', params: { locale: locale.value }});

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
    formValid.value = isAllFilled === true && form.value.errors.length === 0 && formData.terms === true;
  }, 100);
})
</script>

<style scoped>
.log-in-link {
  cursor: pointer;
  text-decoration: none;
}

.reg-form-wrapper {
  max-width: 800px;
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

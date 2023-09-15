<template>
  <v-card class="w-100 elevation-0 rounded-xl py-5 px-5 mx-4 mx--md-0 py-md-10 px-md-10 reg-form-wrapper"
          transition="slide-x-reverse-transition">
    <baseLogo/>
    <div class="text-h4 pt-10 text-center font-weight-bold text-astraDark">
      {{ $t('auth.forgot.title') }}
    </div>
    <div class="body-1 pt-2 text-center text-astraGray d-flex justify-center flex-column flex-sm-row">
      {{ $t('auth.forgot.subtitle') }}
    </div>
    <v-form ref="form" v-model="formValid">
      <v-row class="pt-8 d-flex flex-column align-center">
        <v-col class="py-2" cols="12">
          <v-text-field  v-model="emailModel" :label="$t('auth.forgot.emailField')"
                        :rules="[rules.required, rules.email]"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-btn
      :disabled="!formValid"
      :loading="loading"
      block
      class="rounded-lg mt-5"
      color="primaryLight"
      size="x-large"
      variant="flat"
      @click="submitForm"
    >
      <div class="text-white text-capitalize">{{ $t('auth.forgot.button') }}</div>
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
        <li v-for="error in fieldErrors">
          {{ t("auth.forgot.errors." + error) }}
        </li>
      </ul>
    </template>
  </v-alert>
</template>

<script setup>
import {ref, reactive, watch} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {forgotPassword} from "@/services/auth.api";
import {CheckEmail} from "@/util/constants";
import {useI18n} from 'vue-i18n';
import BaseLogo from "@/components/base/BaseLogo.vue";


const {t, locale} = useI18n();

const router = useRouter();
const store = useStore();
let emailModel = ref();

const form = ref(null);
let formValid = ref(false);
let fieldErrors = ref(false);

let loading = ref(false);

const rules = {
  required: (value) => !!value || t("auth.validations.required"),
  email: (value) => CheckEmail(value) || t("auth.validations.email"),
};

const submitForm = async () => {
  loading.value = true;

  await form.value.validate();
  if (form.value.modelValue === true) {
    const data = {
      email : emailModel.value
    }
    try {
      const response = await forgotPassword(JSON.stringify(data));
      if (response.data.success) {
        await store.commit('userInfoModule/SET_USER_DATA', {
          email : emailModel.value,
          isForgotPassword: true,
        });
        await router.push({name: 'signupStep2', params: {locale: locale.value}});
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

watch(emailModel, () => {
  setTimeout(() => {
    formValid.value = form.value.errors.length === 0;
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

<template>
  <v-card class="w-100 elevation-0 rounded-xl py-5 px-5 mx-4 mx--md-0 py-md-16 px-md-16 reg-form-wrapper">
    <baseLogo/>
    <div class="text-h4 pt-10 text-center font-weight-bold text-astraDark">
      {{ $t('auth.step2.title') }}
    </div>
    <div
      class="body-1 pt-2 text-center text-astraGray d-flex justify-center flex-column"
    >
      {{ $t('auth.step2.subtitle') }}
      <div class="body-1 block pl-1 text-astraDarkGray font-weight-medium">
        {{ userInfo.email }}
      </div>
    </div>
    <v-row class="pt-8 justify-center">
      <v-col class="py-1 pb-8" cols="12" md="12">
        <div class="d-flex justify-center">
          <v-otp-input
            v-model:value="verificationCode"
            :conditionalClass="['one', 'two', 'three', 'four']"
            :num-inputs="6"
            :should-auto-focus="true"
            input-classes="otp-input"
            input-type="number"
            separator=""
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />
        </div>
      </v-col>
    </v-row>
    <div
      class="body-1 pt-2 pb-7 text-center text-astraGray d-flex justify-start"
    >
      {{ $t('auth.step2.resendCodeText') }}
      <div v-if="!resendCodeError && !codeResendLoading" class="body-1 pl-1 text-astraBlue link font-weight-medium"
           @click="resendCode"
           v-html="codeSent ? $t('auth.step2.codeSent') : $t('auth.step2.resendCodeBtn')">
      </div>
      <v-progress-circular v-else-if="codeResendLoading" :size="15" :width="2" class="mt-1 ml-2" color="astraBlue"
                           indeterminate></v-progress-circular>
      <div v-else class="body-1 pl-1 text-error link font-weight-medium">{{ $t('auth.step2.codeError') }}</div>
    </div>
    <div v-if="emailVerificationError" class="d-flex flex-row justify-center align-center text-subtitle-2 text-center pb-5 text-error">
      <v-icon
        color="dark"
        icon="mdi-alert-circle-outline"
        class="pr-2"
      ></v-icon>
      {{ $t('auth.step2.emailVerifyError') }}
    </div>
    <v-btn
      :disabled="verificationCode.length !== 6"
      :loading="emailVerifyLoading"
      block
      class="rounded-lg"
      color="primaryLight"
      size="x-large"
      variant="flat"
      @click="verifyEmail"
    >
      <div class="text-white text-capitalize">{{ $t('auth.step2.button') }}
      </div>
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
  <v-alert class="my-5" closable v-model="resendCodeErrors" transition="fade-transition" color="error" position="absolute" location="top" min-width="320px">
    <template v-slot:text>
      <ul>
        <li v-for="(error,idx) in resendCodeErrors" :key={idx}>
          {{t("auth.step2.errors." + error)}}
        </li>
      </ul>
    </template>
  </v-alert>
</template>

<script setup>
import {ref, computed} from "vue";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import VOtpInput from "vue3-otp-input";
import {signupGetStarted, signupVerifyEmail} from "@/services/auth.api";
import { useI18n } from 'vue-i18n';
import BaseLogo from "@/components/base/BaseLogo.vue";
const { locale } = useI18n();

const store = useStore();
const router = useRouter();
const route = useRoute();

const verificationCode = ref("");

let codeResendLoading = ref(false);
let codeSent = ref(false);
let resendCodeErrors = ref(false);

const userInfo = computed(() => store.getters["userInfoModule/userInfo"]);

let emailVerifyLoading = ref(false);
let emailVerificationError = ref(false);

const verifyEmail = async () => {
  const data = {
    email : userInfo.value.email,
    code: verificationCode.value
  }
  emailVerifyLoading.value = true;
  try {
    const response = await signupVerifyEmail(JSON.stringify(data));
    if (response.data.success) {
      store.commit('authModule/SET_CODE', verificationCode);
      emailVerificationError.value = false;
      if (userInfo.value.isForgotPassword) {
        await router.push({name : 'setpassword', params: { locale: locale.value }});
      } else {
          await router.push({name : 'signupStep3', params: { locale: locale.value }});
      }
    } else {
      emailVerificationError.value = true;
    }
    emailVerifyLoading.value = false;

  } catch(e) {
    console.log(e);
    emailVerifyLoading.value = false;
  }
}

const resendCode = async () => {
  verificationCode.value = "";
  try {
    codeResendLoading.value = true;
    const response = await signupGetStarted(userInfo.value);
    if (response.data.success) {
      codeSent.value = true;
      resendCodeErrors.value = false;
    } else {
      resendCodeErrors.value = response.data.error;
      codeResendLoading.value = false;
      setTimeout(() => {
        resendCodeErrors.value = false;
      }, 5000);
    }
    codeResendLoading.value = false;
  } catch (e) {
    codeResendLoading.value = false;
    console.log(e)
  }
}

const handleOnComplete = (value) => {
  verifyEmail();
};

</script>

<style lang="scss">
.reg-form-wrapper {
  max-width: 568px;
  box-shadow: 3px 5px 10px 0px rgba(42, 131, 135, 0.03) !important;
}

.link {
  cursor: pointer;
}

.otp-input {
  width: 60px;
  height: 48px;
  border: 1px solid #E8E9EA;
  margin: 0 8px;
  border-radius: 8px;
  text-align: center;
  @media only screen and (max-width: 646px) {
    width: 45px;
    height: 40px;
  }

  @media only screen and (max-width: 400px) {
    width: 35px;
    height: 32px;
  }
}
</style>

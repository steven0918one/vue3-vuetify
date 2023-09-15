import httpClient from "@/services/api";
import apiRoutes from "@/services/routes.api";

const signupGetStarted  = (formData) => httpClient.post(apiRoutes.AUTH_SIGNUP_STEP1, formData);
const signupVerifyEmail = (data) => httpClient.post(apiRoutes.AUTH_SIGNUP_STEP2, data);
const signupSetPassword = (data) => httpClient.post(apiRoutes.AUTH_SIGNUP_STEP3, data);
const login = (data) => httpClient.post(apiRoutes.AUTH_LOGIN, data);
const forgotPassword = (data) => httpClient.post(apiRoutes.AUTH_FORGOT_STEP1, data);
const forgotChangePassword = (data) => httpClient.post(apiRoutes.AUTH_FORGOT_STEP2, data);

export {
  signupGetStarted,
  signupVerifyEmail,
  signupSetPassword,
  login,
  forgotPassword,
  forgotChangePassword
}

import {getCookie} from "@/util/constants";
import axios from "axios";
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getJWTToken = () => getCookie('jwt');
const getLocale = () => getCookie('user-locale');

const authInterceptor = (config) => {
  config.headers['Authorization'] = 'Bearer ' + getJWTToken();
  config.headers['Accept-Language'] = getLocale();
  return config;
}

httpClient.interceptors.request.use(authInterceptor);

export default httpClient

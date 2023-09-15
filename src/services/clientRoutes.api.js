import httpClient from "@/services/api";
import apiRoutes from "@/services/routes.api";

const getClientInfo  = (token) => httpClient.post(apiRoutes.GET_CLIENT_INFO, token);

export {
  getClientInfo
}

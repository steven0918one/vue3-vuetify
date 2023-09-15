import httpClient from "@/services/api";
import apiRoutes from "@/services/routes.api";

const getUsersList  = (token) => httpClient.post(apiRoutes.GET_USERS_LIST, token);

const inviteUsers  = (data) => httpClient.post(apiRoutes.INVITE_USERS, data);

const finishInvitedUserRegistration  = (data) => httpClient.post(apiRoutes.FINISH_USER_REGISTRATION, data);

export {
  getUsersList,
  inviteUsers,
  finishInvitedUserRegistration
}

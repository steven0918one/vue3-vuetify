import httpClient from "@/services/api";
import apiRoutes from "@/services/routes.api";

// const getSetting  = (token) => httpClient.post(apiRoutes.GET_PERIOD, token);
const editPeriod  = (data) => httpClient.post(apiRoutes.EDIT_PERIOD, data);

export {
    // getSetting,
    editPeriod
}

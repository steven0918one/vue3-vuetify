import httpClient from "@/services/api";
import apiRoutes from "@/services/routes.api";

const createVenue  = (formData) => httpClient.post(apiRoutes.CREATE_NEW_VENUE, formData);

const getVenues  = (token) => httpClient.post(apiRoutes.GET_VENUES_LIST, token);

const deleteVenue  = (id) => httpClient.post(apiRoutes.DELETE_VENUE, id);

const editVenue  = (venue) => httpClient.post(apiRoutes.EDIT_VENUE, venue);

const getChainlessVenues  = (venue) => httpClient.post(apiRoutes.CHAINLESS_LIST, venue);

export {
  createVenue,
  getVenues,
  deleteVenue,
  editVenue,
  getChainlessVenues
}

<template>
  <div v-if="!isLoadingData" class="pa-2">
    <v-expansion-panels
      v-if="computedChainsList && computedChainsList.length > 0"
      v-model="panel"
      class="elevation-0"
      multiple
    >
      <v-expansion-panel
        v-for="chain in computedChainsList"
        :key="chain._id"
        border
        class="my-3 astra-panel"
        variant="outlined"
      >
        <v-expansion-panel-title
          class="text-h6 fill-height px-4 text-capitalize"
          collapse-icon="mdi-arrow-up"
          color="navy100"
          expand-icon="mdi-arrow-down"
        >
          {{ chain && chain.name ? chain.name : $t("settings.venues.venuesList.heading") }}
          <div class="text-navy600 d-inline ml-1">
            ({{ chain && chain.venues ? chain.venues.length : "0" }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="px-0">
          <v-data-table
            :headers="headers"
            :items="chain ? chain.venues : []"
          >
            <template v-slot:item="{ item }">
              <tr class="table-astra">
                <td>
                  {{
                    item && item.value && item.value.name
                      ? item.value.name
                      : "-" }}
                </td>
                <td>
                  {{
                    item && item.value && item.value.area
                      ? item.value.area.name
                      : "-"
                  }}
                </td>
                <td>
                  {{
                    item && item.value && item.value.country
                      ? item.value.country
                      : "-"
                  }}
                </td>
                <td>
                  {{
                    item && item.value && item.value.city
                      ? item.value.city
                      : "-"
                  }}
                </td>
                <td class="users-col">
                  <div class="w-25">
                    <v-tooltip>
                      <template v-slot:default>
                        <div v-for="user in item.value.users" :key="user._id">
                          {{ user && user.firstName ? user.firstName : "-" }}
                        </div>
                      </template>
                      <template v-slot:activator="{ props }">
                        <div v-bind="props">
                          <v-chip
                            class="user-table-chip font-weight-medium text-astraDark"
                            color="navy400"
                            flat
                          >
                            <div class="text-black">
                              {{
                                item && item.value && item.value.users
                                  ? item.value.users.length
                                  : ""
                              }}
                            </div>
                          </v-chip>
                        </div>
                      </template>
                    </v-tooltip>
                  </div>
                </td>
                <td v-if="userRole >= adminRole">
                  <v-icon
                    class="mx-2 ml-0 actions-btn edit-btn"
                    icon="mdi-pencil"
                    @click="editVenue(item.value)"
                  ></v-icon>
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <v-icon
                        :color="isHovering ? 'error' : ''"
                        :icon="isHovering ? 'mdi-delete' : 'mdi-delete-outline'"
                        class=" actions-btn"
                        v-bind="props"
                        @click="openVenueDeleteDialog(item.value._id)"
                      ></v-icon>
                    </template>
                  </v-hover>
                </td>
              </tr>
            </template>
            <template v-slot:bottom><!-- MUST BE EMPTY --></template>
          </v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-else class="text-body-1 px-2 fill-height">No Records</div>
    <ConfirmDeleteDialog
      :id="venueId"
      v-model="openConfirmDeleteDialog"
      @closeModal="openConfirmDeleteDialog = false"
      @confirmDelete="deleteUserVenue"
      :loading="loading"
    ></ConfirmDeleteDialog>
  </div>
  <div v-else class="fill-height d-flex justify-center align-center">
    <v-progress-circular
      color="white"
      indeterminate
      size="30"
      width="2"
    ></v-progress-circular>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed} from "vue";
import { getVenues } from "@/services/venueRoutes.api";
import ConfirmDeleteDialog from "@/components/base/ConfirmDeleteDialog.vue";
import { deleteVenue } from "@/services/venueRoutes.api";
import {useStore} from "vuex";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {adminRole} from "@/util/constants";

const {t, locale} = useI18n();

const store = useStore();
const router = useRouter();

let search = ref("");
let chainsList = ref([]);
let isLoadingData = ref(true);
const panel = ref(0);
let loading = ref(false);

let computedChainsList = computed(() => {
  console.log("computedChainslist. length :", chainsList.value.length);
  return chainsList.value;
});

const userRole = computed(() => store.getters['userInfoModule/role']);

let openConfirmDeleteDialog = ref(false);
let venueId = ref(null);
const openVenueDeleteDialog = (id) => {
  openConfirmDeleteDialog.value = true;
  venueId.value = id;
};

const editVenue =  async (venue) => {
  await store.commit('venuesModule/SET_VENUE_DATA', venue);
  await router.push({ name:'edit-venue', params: { locale: locale.value }});
}
const deleteUserVenue = async (id) => {
  loading.value = true;
  const venueId = {
    id: id,
  };
  const response = await deleteVenue(JSON.stringify(venueId));
  if (response.data.success) {
    const chain = chainsList.value.find((item) => {
      return item.venues.some((venue) => venue._id === id);
    });
    const venue = chain.venues.find((item) => item._id === id);
    chain.venues.splice(chain.venues.indexOf(venue), 1);
    if (chain.venues.length === 0) {
      chainsList.value.splice(chainsList.value.indexOf(chain), 1);
    }
    openConfirmDeleteDialog.value = false;
  }
  loading.value = false;
};

const headers = [
  { title: "Venue", key: "name", sortable: true },
  { title: "Area", key: "area.name", sortable: true },
  { title: "Country", key: "country", sortable: true },
  { title: "City", key: "city", sortable: true },
  { title: "Users", key: "users.length", sortable: true },
  { title: "actions" },
];

onBeforeMount(async () => {
  store.commit('venuesModule/SET_VENUE_DATA', false);
  const response = await getVenues();
  chainsList.value = response.data.value;
  isLoadingData.value = false;
  if (userRole.value < adminRole) {
    headers.pop();
  }
});
</script>

<style lang="scss" scoped>
.astra-table {
  border: 1px solid;
}

.v-table {
  border-top: 1px solid #e8e9ea;
  border-bottom: 1px solid #e8e9ea;
  position: relative;
}

.action-btn {
  cursor: pointer;
}

.venue-users-list {
  cursor: pointer;
}

.custom-tooltip {
  opacity: 1;
  background: red;
}

.table-astra {
  &:nth-child(odd) {
    background-color: #fbfcfc;
  }

  td {
    background: transparent !important;
  }
}

.users-col,
.user-table-chip {
  cursor: pointer;
}

.v-expansion-panel-title--active {
  background: white !important;
}

.v-expansion-panel-title {
  height: 80px !important;
  background: white !important;

  &:hover {
    background: white !important;
  }
}

.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
  > :first-child:not(:last-child):not(.v-expansion-panel--active):not(
    .v-expansion-panel--before-active
  ) {
  border-radius: 20px !important;
  box-shadow: none;
}

.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
  > :not(:first-child):not(:last-child):not(.v-expansion-panel--active):not(
    .v-expansion-panel--before-active
  ) {
  border-radius: 20px !important;
  box-shadow: none;
}

:deep(.v-expansion-panel__shadow) {
  display: none !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}

.astra-panel {
  border: 1px solid #f1f1f1;
  overflow: hidden;
}

.v-expansion-panel:not(:first-child)::after {
  display: none;
}

:deep(
    .v-expansion-panel-title--active > .v-expansion-panel-title__overlay,
    .v-expansion-panel-title[aria-haspopup="menu"][aria-expanded="true"]
      > .v-expansion-panel-title__overlay
  ) {
  opacity: 0 !important;
}

.v-expansion-panel {
  border-radius: 20px;
}

.actions-btn {
  cursor: pointer;
}

.delete-btn {
  &:hover {
    color: #b6334b;
  }
}

.edit-btn {
  &:hover {
    color: #4374bd;
  }
}
</style>

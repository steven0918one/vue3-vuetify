<template>
  <v-card class="invite-user-wrapper mx-auto elevation-0 mt-3">
    <v-card class="d-flex align-center px-4 py-2" flat>
      <v-icon
        color="dark"
        icon="mdi-arrow-left"
        @click="router.go(-1)"
      ></v-icon>
      <v-card-title class="px-3 text-h6"
        >{{ t("settings.users.inviteUsers.inviteUserFormTitle") }}
      </v-card-title>
    </v-card>
    <v-divider class="border-opacity-20"></v-divider>
    <v-card-item>
      <v-form ref="form" v-model="inviteUserFormModel">
        <v-row v-for="(userForm, i) in usersForm" :key="i" class="pt-8">
          <v-col class="py-2" cols="12" md="6">
            <v-text-field
              v-model="userForm.firstName"
              :label="$t('settings.users.inviteUsers.firstName')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-text-field
              v-model="userForm.lastName"
              :label="$t('settings.users.inviteUsers.lastName')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-text-field
              v-model="userForm.email"
              :label="$t('settings.users.inviteUsers.email')"
              :rules="[rules.required, rules.email]"
              type="email"
            ></v-text-field>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-select
              v-model="userForm.role"
              :items="roles"
              :label="$t('settings.users.inviteUsers.permissionGroup')"
              :rules="[rules.required]"
              density="comfortable"
              hide-details
              item-title="role"
              item-value="value"
              variant="outlined"
            >
              <template v-slot:selection="{ item }">
                <v-icon
                  :color="
                    item.value === 1
                      ? 'blue'
                      : item.value === 2
                      ? 'green'
                      : item.value === 3
                      ? 'red'
                      : 'transparent'
                  "
                  class="pr-2"
                  icon="mdi-circle"
                ></v-icon>
                {{ item.title }}
              </template>
            </v-select>
          </v-col>
          <div
            v-if="usersForm.length > 1"
            class="w-100 d-flex justify-end px-3"
          >
            <v-btn
              class="align-self-end"
              color="error"
              variant="text"
              @click="removeUserFormRow(i)"
              >{{ t("settings.users.inviteUsers.removeUserBtnTitle") }}
            </v-btn>
          </div>
        </v-row>
        <v-btn
          class="text-capitalize font-weight-bold mt-2"
          color="astraActiveNav"
          prepend-icon="mdi-plus"
          variant="text"
          @click="addUserFormRow"
        >
          {{ t("settings.users.inviteUsers.addUserBtnTitle") }}
        </v-btn>
      </v-form>
    </v-card-item>

    <v-card-item class="pb-3">
      <div class="font-weight-bold pl-1">
        {{ $t("settings.users.inviteUsers.assignedVenues") }}

        <div class="text-astraGray d-inline" >
          ({{ assignedVenuesListLength }})
        </div>
      </div>
      <div>
        <v-expansion-panels
          v-if="assignedVenuesList.length > 0"
          v-model="panel"
          class="elevation-0"
          multiple
        >
          <v-expansion-panel
            v-for="chain in assignedVenuesList"
            :key="chain._id"
            border
            class="my-3 astra-panel"
            variant="outlined"
          >
            <v-expansion-panel-title
              class="text-body-1 font-weight-bold fill-height px-4 py-0 my-0 text-capitalize"
              collapse-icon="mdi-arrow-up"
              color="navy100"
              expand-icon="mdi-arrow-down"
            >
              {{ chain && chain.name ? chain.name : "Venues" }}
              <div class="text-navy600 d-inline ml-1" >
                ({{  chain.venues && chain ? chain.venues.length : '' }})
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="px-0 d-block">
              <VenueCard
                v-for="venue in chain.venues"
                :key="venue._id"
                :venueData="venue"
                class="mb-3"
                @unAssignVenue="unAssignVenue(venue)"
              ></VenueCard>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-dialog
        v-model="assignVenueDialog"
        class="block pa-0 ma-0 ml-auto h-100 assign-user-dialog"
        fullscreen
        scrollable
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            class="assign-btn rounded-lg my-4 text-body-2 text-astraDark"
            flat
            prepend-icon="mdi-link-variant"
            @click="getChainlessVenuesList"
            >{{ $t("settings.venues.createVenue.assignBtn") }}
          </v-btn>
        </template>
        <v-card>
          <v-card class="d-flex align-center px-4 py-2" color="#FBFCFC" flat>
            <v-icon
              color="dark"
              icon="mdi-arrow-left"
              @click="assignVenueDialog = false"
            ></v-icon>
            <v-card-title class="px-3 text-h6"
              >{{ $t("settings.users.inviteUsers.assignVenues") }}
            </v-card-title>
          </v-card>
          <v-divider class="border-opacity-20"></v-divider>
          <div class="py-1">
            <v-text-field
              class="pa-3 pt-0"
              hide-details
              placeholder="Search for anything"
              variant="underlined"
            >
              <template v-slot:prepend-inner>
                <v-icon
                  class="pt-3"
                  color="astraGray"
                  icon="mdi-magnify"
                  @click="search"
                ></v-icon>
              </template>
            </v-text-field>
          </div>
          <v-divider class="border-opacity-20"></v-divider>
          <v-data-table
            :headers="tableHeaders"
            :item-value="(item) => item._id"
            :items="venuesList"
          >
            <template v-slot:column.checkbox="{ column }">
              <td>
                <v-checkbox
                  v-model="allSelected"
                  :indeterminate="
                    allSelected && venuesTableModel.length < venuesList.length
                  "
                  color="astraBlue"
                  hide-details
                  @click="selectAll"
                ></v-checkbox>
              </td>
            </template>
            <template v-slot:item="{ item }">
              <tr
                :class="{
                  'highlight-row': venuesTableModel.includes(
                    item.props.title._id
                  ),
                }"
                class="table-astra"
              >
                <td>
                  <v-checkbox
                    v-model="venuesTableModel"
                    :value="item.props.title._id"
                    color="astraBlue"
                    hide-details
                  ></v-checkbox>
                </td>
                <td>
                  {{ item.props.title.chain && item.props.title.chain.name ? item.props.title.chain.name : '-' }}
                </td>
                <td>
                  {{ item.props.title.name ? item.props.title.name : '' }}
                </td>
                <td>
                  {{ item.props.title.country ? item.props.title.country : '' }}
                </td>
                <td>
                  {{ item.props.title.area && item.props.title.area.name ? item.props.title.area.name : '' }}
                </td>
                <td>
                  {{ item.props.title.city ? item.props.title.city : '' }}
                </td>
              </tr>
            </template>
            <template v-slot:bottom><!-- MUST BE EMPTY --></template>
          </v-data-table>
          <div class="d-flex justify-center mt-3">
            <v-btn
              class="action-btn rounded-lg mx-3"
              color="error"
              variant="outlined"
              @click="assignVenueDialog = false"
              >{{ $t("settings.users.inviteUsers.discardBtn") }}
            </v-btn>
            <v-btn
              class="action-btn rounded-lg mx-3"
              color="primaryLight"
              flat
              variant="flat"
              @click="assignVenues"
            >
              <div class="text-white">
                {{ $t("settings.users.inviteUsers.assignVenuesBtnTitle") }}
              </div>
              <template v-slot:loader>
                <v-progress-circular
                  color="red"
                  indeterminate
                ></v-progress-circular>
              </template>
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-card-item>

    <v-divider></v-divider>

    <v-card-actions>
      <div class="py-5 d-flex justify-center w-100">
        <v-btn
          class="action-btn rounded-lg mx-3"
          color="error"
          variant="outlined"
          @click="router.go(-1)"
          >{{ $t("settings.users.inviteUsers.discardBtn") }}
        </v-btn>
        <v-btn
          :disabled="!inviteUserFormModel || assignedVenuesList.length === 0"
          :loading="loading"
          class="action-btn rounded-lg mx-3"
          color="primaryLight"
          flat
          variant="flat"
          @click="submitUserInvitationForm"
        >
          <div class="text-white">
            {{ t("settings.users.inviteUsers.inviteUserFormBtnTitle") }}
          </div>
        </v-btn>
      </div>
    </v-card-actions>
    <v-alert
      v-model="InviteUsersResponseErrors"
      class="my-5"
      closable
      color="error"
      location="top"
      min-width="320px"
      position="absolute"
      transition="fade-transition"
    >
      <template v-slot:text>
        <ul>
          <li v-for="(error, idx) in InviteUsersResponseErrors" :key="{ idx }">
            <div v-if="translationExists('settings.users.inviteUsers.errors.' + error)" >{{ t("settings.users.inviteUsers.errors." + error) }}</div>
          </li>
        </ul>
      </template>
    </v-alert>
    <v-alert
      v-model="InviteUsersResponseSuccess"
      class="my-5"
      closable
      color="primary"
      location="top"
      min-width="320px"
      position="absolute"
      transition="fade-transition"
    >
      <template v-slot:text>
        {{ t("settings.users.inviteUsers.inviteSuccess") }}
      </template>
    </v-alert>
  </v-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import { CheckEmail } from "@/util/constants";
import VenueCard from "@/components/settings/venues/VenueCard.vue";
import { getChainlessVenues } from "@/services/venueRoutes.api";
import { inviteUsers } from "@/services/usersRoutes.api";

let loading = ref(false);

const router = useRouter();
const store = useStore();

const usersForm = reactive([]);
let inviteUserFormModel = ref(false);
let InviteUsersResponseErrors = ref(false);
let InviteUsersResponseSuccess = ref(false);

const assignedVenuesList = ref([]);

const venuesTableModel = ref([]);
const venuesList = ref([]);
const assignVenueDialog = ref(false);
const panel = ref(0);
const allSelected = ref(false);
const { t, locale } = useI18n();
const form = ref();

const roles = [
  { role: t("roleNames.admin"), value: 3 },
  { role: t("roleNames.manager"), value: 2 },
  { role: t("roleNames.employee"), value: 1 },
];

const tableHeaders = [
  { title: "", key: "checkbox", sortable: false },
  {
    title: t("settings.users.inviteUsers.tableHeaders.chain"),
    key: "chain.name",
    sortable: true,
  },
  {
    title: t("settings.users.inviteUsers.tableHeaders.venue"),
    key: "name",
    sortable: true,
  },
  {
    title: t("settings.users.inviteUsers.tableHeaders.country"),
    key: "country",
    sortable: true,
  },
  {
    title: t("settings.users.inviteUsers.tableHeaders.area"),
    key: "area.name",
    sortable: true,
  },
  {
    title: t("settings.users.inviteUsers.tableHeaders.city"),
    key: "city",
    sortable: true,
  },
];

const assignedVenuesListLength = computed(() => {
  let length = 0;
  assignedVenuesList.value.forEach((chain) => {
    length += chain.venues.length;
  });
  return length;
});

onMounted(async () => {
  usersForm.push({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
  });
});

const translationExists = (key) => {
  return t(key);
}

const selectAll = () => {
  venuesTableModel.value = [];

  if (!allSelected.value) {
    venuesList.value.forEach((venue) => {
      venuesTableModel.value.push(venue._id);
    });
  }
};
const search = () => {
  //
};

const rules = {
  required: (value) => !!value || t("auth.validations.required"),
  email: (value) => CheckEmail(value) || t("auth.validations.email"),
};

const addUserFormRow = () => {
  usersForm.push({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
  });
};

const removeUserFormRow = (index) => {
  const row = usersForm.find((item, i) => i == index);
  usersForm.splice(usersForm.indexOf(row), 1);
};

const getChainlessVenuesList = async () => {
  assignVenueDialog.value = true;
  try {
    const response = await getChainlessVenues();
    if (response.data.success) {
      venuesList.value = response.data.value.value;
    }
  } catch (e) {
    console.log(e);
  }
};

const assignVenues = async () => {
  assignedVenuesList.value = [];
  venuesTableModel.value.forEach((id) => {
    const data = venuesList.value.find((item) => item._id === id);
    const chainName = data.chain && data.chain.name ? data.chain.name : '';
    const venue = data;

    let chain = assignedVenuesList.value.find(
      (item) => item.name === chainName
    );
    if (!chain) {
      chain = {
        _id: data.chain && data.chain._id ? data.chain._id : '',
        name: data.chain && data.chain.name ? data.chain.name : '',
        venues: [],
      };
      assignedVenuesList.value.push(chain);
    }

    let venueAlreadyIsIncluded = chain.venues.find(
      (item) => item._id === venue._id
    );
    if (!venueAlreadyIsIncluded) {
      chain.venues.push(venue);
    }
  });
  assignVenueDialog.value = false;
};

const unAssignVenue = (venue) => {
  assignedVenuesList.value.forEach((chain) => {
    if (chain.venues.includes(venue)) {
      chain.venues.splice(chain.venues.indexOf(chain.venues[venue]), 1);
      venuesTableModel.value.splice(
        venuesTableModel.value.indexOf(venue._id),
        1
      );
    }

    if (chain.venues.length < 1) {
      assignedVenuesList.value.splice(
        assignedVenuesList.value.indexOf(chain),
        1
      );
    }
  });
};

const submitUserInvitationForm = async () => {
  loading.value = true;
  let formData = {
    users: [],
    venues: [],
  };

  usersForm.forEach((user) => {
    formData.users.push(user);
  });
  assignedVenuesList.value.forEach((chain) => {
    chain.venues.forEach((venue) => {
      formData.venues.push(venue._id);
    });
  });
  try {
    const response = await inviteUsers(JSON.stringify(formData));
    if (response.data.success) {
      InviteUsersResponseSuccess.value = true;
      setTimeout(() => {
        router.push({ name: "users", params: { locale: locale.value } });
      }, 1000);
    } else {
      form.value.reset();
      assignedVenuesList.value = [];
      venuesTableModel.value = [];
      InviteUsersResponseErrors.value = response.data.error;
      loading.value = false;
      setTimeout(() => {
        InviteUsersResponseErrors.value = false;
      }, 5000);
    }
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
  loading.value = false;
};
</script>

<style lang="scss" scoped>
.invite-user-wrapper {
  max-width: 800px;
  width: 100%;
  border: 1px solid #e8e9ea;
  border-radius: 12px;
}

.assign-user-dialog {
  max-width: 768px;
  width: 100%;
}

.assign-btn {
  border: 1px solid #e8e9ea;
  background: #42c0c508;
  min-width: 103px;
  min-height: 40px;
}

.action-btn {
  min-width: 96px;
  min-height: 48px;
}

:deep(.v-field--variant-underlined .v-field__outline::before) {
  display: none !important;
}

:deep(.v-field--variant-underlined .v-field__outline::after) {
  display: none !important;
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
  padding: 0 20px !important;
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

:deep(v-data-table__tr) {
  &:hover {
    background: green !important;
  }
}

.v-data-table__wrapper > table > tbody > tr:hover {
  background: green;
}

.table-astra {
  &:nth-child(odd) {
    background-color: #fbfcfc;
  }

  td {
    background: transparent !important;
  }
}

.highlight-row {
  background: rgba(67, 116, 189, 0.05) !important;
}
</style>

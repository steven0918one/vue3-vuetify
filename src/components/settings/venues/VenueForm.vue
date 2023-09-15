<template>
  <v-card
    v-if="clientInfo"
    class="create-venue-wrapper mx-auto elevation-0 mt-3"
  >
    <v-card class="d-flex align-center px-4 py-2" flat>
      <v-icon
        color="dark"
        icon="mdi-arrow-left"
        @click="handleBackBtnClick"
      ></v-icon>
      <v-card-title class="px-3 text-h6"
        >{{venueFormTitle}}
      </v-card-title>
    </v-card>
    <v-divider class="border-opacity-20"></v-divider>
    <v-card-item>
      <v-form v-model="venueFormModel" ref="form">
        <v-row class="pt-8">
          <v-col class="py-2" cols="12" md="6">
            <v-text-field
              v-model="venueForm.name"
              :label="$t('settings.venues.createVenue.venueName')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-combobox
              v-model="venueForm.chain"
              :hide-no-data="false"
              :items="chainItems"
              :label="$t('settings.venues.createVenue.chainName')"
              density="comfortable"
              persistent-hint
              return-object
              variant="outlined"
              @keydown.enter="addItem(chainItems, venueForm.chain)"
            >
              <template v-slot:prepend-item>
                <div
                  v-if="
                    chainItems.length &&
                    chainItems.find((item) =>
                      item.toLowerCase().includes(venueForm.chain.toLowerCase())
                    )
                  "
                  class="pa-3 pt-2 pl-5 text-astraBlue font-weight-medium d-flex suggestions-text"
                >
                  <v-icon
                    class="pr-3"
                    icon="mdi-auto-fix"
                    size="small"
                  ></v-icon>
                  Suggestions
                </div>
              </template>
            </v-combobox>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-combobox
              v-model="venueForm.area"
              :hide-no-data="false"
              :items="areaItems"
              :label="$t('settings.venues.createVenue.area')"
              density="comfortable"
              persistent-hint
              return-object
              variant="outlined"
              @keydown.enter="addItem(areaItems, venueForm.area)"
            >
              <template v-slot:prepend-item>
                <div
                  v-if="
                    areaItems.length &&
                    areaItems.find((item) =>
                      item.toLowerCase().includes(venueForm.area.toLowerCase())
                    )
                  "
                  class="pa-3 pt-2 pl-5 text-astraBlue font-weight-medium d-flex suggestions-text"
                >
                  <v-icon
                    class="pr-3"
                    icon="mdi-auto-fix"
                    size="small"
                  ></v-icon>
                  Suggestions
                </div>
              </template>
            </v-combobox>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-text-field
              v-model="venueForm.address"
              :label="$t('settings.venues.createVenue.address')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-combobox
              v-model="venueForm.district"
              :hide-no-data="false"
              :items="districtItems"
              :label="$t('settings.venues.createVenue.district')"
              density="comfortable"
              persistent-hint
              return-object
              variant="outlined"
              @keydown.enter="addItem(districtItems, venueForm.district)"
            >
              <template v-slot:prepend-item>
                <div
                  v-if="
                    districtItems.length &&
                    districtItems.find((item) =>
                      item
                        .toLowerCase()
                        .includes(venueForm.district.toLowerCase())
                    )
                  "
                  class="pa-3 pt-2 pl-5 text-astraBlue font-weight-medium d-flex suggestions-text"
                >
                  <v-icon
                    class="pr-3"
                    icon="mdi-auto-fix"
                    size="small"
                  ></v-icon>
                  Suggestions
                </div>
              </template>
            </v-combobox>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-text-field
              v-model="venueForm.zipcode"
              :label="$t('settings.venues.createVenue.zipCode')"
              :rules="[rules.required]"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-combobox
              v-model="venueForm.country"
              :hide-no-data="false"
              :items="countryItems"
              :label="$t('settings.venues.createVenue.country')"
              :rules="[rules.required]"
              density="comfortable"
              persistent-hint
              return-object
              variant="outlined"
              @keydown.enter="addItem(countryItems, venueForm.country)"
            >
              <template v-slot:prepend-item>
                <div
                  v-if="
                    countryItems.length &&
                    countryItems.find((item) =>
                      item
                        .toLowerCase()
                        .includes(venueForm.country.toLowerCase())
                    )
                  "
                  class="pa-3 pt-2 pl-5 text-astraBlue font-weight-medium d-flex suggestions-text"
                >
                  <v-icon
                    class="pr-3"
                    icon="mdi-auto-fix"
                    size="small"
                  ></v-icon>
                  Suggestions
                </div>
              </template>
            </v-combobox>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-combobox
              v-model="venueForm.city"
              :hide-no-data="false"
              :items="cityItems"
              :label="$t('settings.venues.createVenue.city')"
              :rules="[rules.required]"
              density="comfortable"
              persistent-hint
              return-object
              variant="outlined"
              @keydown.enter="addItem(cityItems, venueForm.city)"
            >
              <template v-slot:prepend-item>
                <div
                  v-if="
                    cityItems.length &&
                    cityItems.find((item) =>
                      item.toLowerCase().includes(venueForm.city.toLowerCase())
                    )
                  "
                  class="pa-3 pt-2 pl-5 text-astraBlue font-weight-medium d-flex suggestions-text"
                >
                  <v-icon
                    class="pr-3"
                    icon="mdi-auto-fix"
                    size="small"
                  ></v-icon>
                  Suggestions
                </div>
              </template>
            </v-combobox>
          </v-col>
          <v-col class="py-2" cols="12" md="6">
            <v-select
              v-model="venueForm.currency"
              :items="currencies"
              :label="$t('settings.venues.createVenue.currencyOfImports')"
              :rules="[rules.required]"
              density="comfortable"
              item-value="name"
              variant="outlined"
            >
              <template v-slot:item="{ props, item }">
                <div
                  class="text-uppercase pa-3 d-flex currency-text"
                  v-bind="props"
                  :title="item.raw.name.toUpperCase()"
                >
                  <div class="pr-1">{{ item.raw.symbol }} /</div>
                  {{ item.raw.name }}
                </div>
              </template>
              <template v-slot:selection="{ props, item }">
                <div class="text-uppercase mx-1">{{ item.raw.symbol }}</div>
                <div v-if="venueForm.currency">/</div>
                <div class="text-uppercase mx-1">{{ item.raw.name }}</div>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>
    <v-card-item class="pb-3">
      <div class="font-weight-bold pl-1">
        {{ $t("settings.venues.createVenue.assignedUsers") }}
        <div class="text-astraGray d-inline">
          ({{ assignedUsersList.length }})
        </div>
      </div>
      <div>
        <div v-for="user in assignedUsersList" :key="user.firstName">
          <UserCard
            :preventUserDeleting="user._id === userInfo._id"
            :userInfo="user"
            @unassignUser="unassignUser"
          ></UserCard>
        </div>
      </div>
      <v-dialog
        v-model="assignUsersDialog"
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
            @click="getUsers"
            >{{ $t("settings.venues.createVenue.assignBtn") }}
          </v-btn>
        </template>
        <v-card>
          <v-card class="d-flex align-center px-4 py-2" color="#FBFCFC" flat>
            <v-icon
              color="dark"
              icon="mdi-arrow-left"
              @click="assignUsersDialog = false"
            ></v-icon>
            <v-card-title class="px-3 text-h6"
              >{{ $t("settings.venues.createVenue.assignUsers") }}
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
                  icon="mdi-magnify"
                  @click="search"
                  color="astraGray"
                ></v-icon>
              </template>
              <template v-slot:append-inner>
                <v-icon
                  class="pt-3"
                  :icon="
                    isAscending ? 'mdi-sort-descending' : 'mdi-sort-ascending'
                  "
                  @click="isAscending = !isAscending"
                  color="black"
                ></v-icon>
              </template>
            </v-text-field>
          </div>
          <v-divider class="border-opacity-20"></v-divider>
          <v-card-item>
            <div v-for="user in sortByAlphabet(usersList)" :key="user._id">
              <UserCard
                :preventUserDeleting="true"
                :selectingUsers="true"
                :userInfo="user"
                @assignUser="assignUser"
              ></UserCard>
            </div>
          </v-card-item>
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
          >{{ $t("settings.venues.createVenue.discardBtn") }}
        </v-btn>
        <v-btn
          :disabled="!venueFormModel"
          :loading="loading"
          class="action-btn rounded-lg mx-3"
          color="primaryLight"
          flat
          variant="flat"
          @click="submitVenueForm"
        >
          <div class="text-white">
            {{venueFormBtnTitle}}
          </div>
        </v-btn>
      </div>
    </v-card-actions>
    <v-alert
      v-model="createVenueResponseErrors"
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
          <li v-for="(error, idx) in createVenueResponseErrors" :key="{ idx }">
            {{ t("settings.venues.createVenue.errors." + error) }}
          </li>
        </ul>
      </template>
    </v-alert>
  </v-card>
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
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, computed, watch,onBeforeMount } from "vue";
import { currencies } from "@/util/constants";
import UserCard from "@/components/settings/users/UserCard.vue";
import { getClientInfo } from "@/services/clientRoutes.api";
import { createVenue, editVenue } from "@/services/venueRoutes.api";
import { getUsersList } from "@/services/usersRoutes.api";
import { useStore } from "vuex";

let loading = ref(false);
let isAscending = ref(false);
const router = useRouter();
const venueForm = reactive({
  name: "",
  chain: "",
  area: "",
  currency: "",
  address: "",
  district: "",
  zipcode: "",
  city: "",
  country: "",
  users: [],
});
let venueFormModel = ref(false);
let createVenueResponseErrors = ref(false);
const store = useStore();
let usersList = reactive(null);
let assignedUsersList = reactive([]);
const assignUsersDialog = ref(false);
let clientInfoResponse = ref(null);
const form = ref(null);

const clientInfo = computed(() => {
  return clientInfoResponse.value ? clientInfoResponse.value.data.value : null;
});

const { t, locale } = useI18n();

const chainItems = computed(() => {
  return clientInfo.value ? clientInfo.value.chains : [];
});

const areaItems = computed(() => {
  return clientInfo.value ? clientInfo.value.areas : [];
});

const districtItems = computed(() => {
  return clientInfo.value ? clientInfo.value.districts : [];
});

const cityItems = computed(() => {
  return clientInfo.value ? clientInfo.value.cities : [];
});

const countryItems = computed(() => {
  return clientInfo.value ? clientInfo.value.countries : [];
});

const userInfo = computed(() => store.getters[`userInfoModule/userInfo`]);
//const venueIsEditing = computed(() => store.getters["venuesModule/isEditing"]);

const venueData = computed(() => store.getters["venuesModule/venue"]);

const venueFormTitle = computed(() => {
  return  venueData.value && venueData.value._id
    ? t("settings.venues.createVenue.editTitle")
    : t("settings.venues.createVenue.title")
})

const venueFormBtnTitle = computed(() => {
  return venueData && venueData.value && venueData.value._id
    ? t("settings.venues.createVenue.updateVenueBtn")
    : t("settings.venues.createVenue.createBtn")
})

onMounted(async () => {
  if (venueData && venueData.value && venueData.value._id) {
    venueForm.name = venueData.value.name;
    venueForm.chain = venueData.value.chain ? venueData.value.chain.name : "";
    venueForm.area = venueData.value.area ? venueData.value.area.name : "";
    venueForm.currency = venueData.value.currency.name;
    venueForm.address = venueData.value.address;
    venueForm.district = venueData.value.district
      ? venueData.value.district
      : "";
    venueForm.zipcode = venueData.value.zipcode;
    venueForm.city = venueData.value.city;
    venueForm.country = venueData.value.country;
    venueForm.users = venueData.value.users;

    assignedUsersList = venueData.value.users;
    let owner = assignedUsersList.find(
      (item) => item._id === userInfo.value._id
    );
    assignedUsersList.splice(assignedUsersList.indexOf(owner), 1);
  }
  try {
    clientInfoResponse.value = await getClientInfo();
    store.commit(
      "clientInfoModule/SET_CLIENT_INFO",
      clientInfoResponse.value.data.value
    );
  } catch (e) {
    console.log(e);
  }
  assignedUsersList.push(userInfo.value);
});

const search = () => {
  //
};

const sortByAlphabet = (array) => {
  array.sort(function (a, b) {
    // Convert both item names to lowercase for case-insensitive sorting
    let nameA = a.firstName.toLowerCase();
    let nameB = b.firstName.toLowerCase();

    // Compare the item names and return the comparison result
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });
  return isAscending.value === true ? array.reverse() : array;
};

const getUsers = async () => {
  if (usersList === null) {
    const response = await getUsersList();
    usersList = reactive(response.data.value);
    let owner = usersList.find((item) => item._id === userInfo.value._id);
    usersList.splice(usersList.indexOf(owner), 1);
    if (assignedUsersList.length > 0) {
      assignedUsersList.forEach((item) => {
        let removeAlreadyAssignedUser = usersList.find(
          (user) => user._id === item._id
        );
        if (removeAlreadyAssignedUser !== undefined) {
          usersList.splice(usersList.indexOf(removeAlreadyAssignedUser), 1);
        }
      });
    }
  }
  assignUsersDialog.value = true;
};

const assignUser = (data) => {
  assignedUsersList.push(data);
  let user = usersList.find((item) => item._id === data._id);
  usersList.splice(usersList.indexOf(user), 1);
};

const unassignUser = async (data) => {
  if (usersList === null) {
    await getUsers();
    assignUsersDialog.value = false;
  }
  usersList.push(data);
  let user = assignedUsersList.find((item) => item._id === data._id);
  assignedUsersList.splice(assignedUsersList.indexOf(user), 1);
};

const handleBackBtnClick = async () => {
  if (userInfo.value && userInfo.value.venues.length > 0) {
    router.go(-1);
  } else {
    await router.push({ name: "venues", params: { locale: locale.value } });
  }
};

const submitVenueForm = async () => {
  try {
    if (venueFormModel) {
      loading.value = true;
      if (venueData && venueData.value && venueData.value._id) { venueForm.users = [] ; }
      assignedUsersList.forEach((item) => {
        venueForm.users.push(item._id);
      });
      let response = null;
      if (venueData && venueData.value && venueData.value._id) {
        venueForm.id = venueData.value._id;
        response = await editVenue(JSON.stringify(venueForm));
      } else {
        response = await createVenue(JSON.stringify(venueForm));
      }
      if (response.data.success) {
        await router.push({
          name: "venues",
          params: { locale: locale.value },
        });
        loading.value = false;
      } else {
        createVenueResponseErrors.value = response.data.error;
        loading.value = false;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const addItem = async (target, item) => {
  if (!target.includes(item.toLowerCase()) && item.length > 0) {
    target.push(item);
  }
};

const rules = {
  required: (value) => !!value || t("auth.validations.required"),
};

watch(venueForm, async (newValue, oldValue) => {
  if (venueData && newValue !== venueData.value) {
    venueFormModel.value = true;
    if (form.value && venueData && venueData.value && venueData.value._id) {
      form.value.validate();
    }
  }
});
</script>

<style lang="scss" scoped>
.create-venue-wrapper {
  max-width: 800px;
  width: 100%;
  border: 1px solid #e8e9ea;
  border-radius: 12px;
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

.user-settings-menu-item {
  border-bottom: 1px solid #e8e9ea;
  width: 100%;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(60, 188, 193, 0.03) !important;
  }
}

.suggestions-text {
  border-bottom: 1px solid #e8e9ea;
}

.assign-user-dialog {
  max-width: 768px;
  width: 100%;
}

.currency-text {
  cursor: pointer;
  &:hover {
    background: #dbdbdb;
  }
}

:deep(.v-field--variant-underlined .v-field__outline::before) {
  display: none !important;
}

:deep(.v-field--variant-underlined .v-field__outline::after) {
  display: none !important;
}
</style>

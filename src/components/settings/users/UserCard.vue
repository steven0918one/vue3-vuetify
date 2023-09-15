<template>
  <v-card
    v-if="chipData"
    class="elevation-0 user-card w-100 h-100 my-5 rounded-lg d-flex"
    border
    :class="props.selectingUsers ? 'align-center' : 'align-center'"
    :color="props.selectingUsers ? '#FBFCFC' : ''"
  >
    <div class="select-user">
      <v-checkbox
        :value="props.userInfo"
        v-if="props.selectingUsers"
        @change="handleCheckboxClick"
        hide-details
        color="primary"
        class="ml-1 mr-0"
      ></v-checkbox>
    </div>
    <UserAvatar
      :class="props.selectingUsers ? 'mx-0' : 'mx-3'"
      :user="userInfo"
    ></UserAvatar>
    <v-card-item
      class="px-0"
      :class="props.selectingUsers ? 'flex-column align-start' : ''"
    >
      <div class="d-flex align-center">
        <div class="text-body-1 font-weight-medium">{{ fullName }}</div>
        <v-chip
          class="rounded chip-assigning-user text-caption d-flex justify-center mx-2"
          color="#E8E9EA"
        >
          <div class="text-astraDark">
            {{ chipData.title }}
          </div>
        </v-chip>
      </div>
      <div class="text-body-2 text-astraGray">{{ props.userInfo.email }}</div>
    </v-card-item>
    <v-spacer></v-spacer>
    <v-card-item class="pr-0">
      <v-chip
        v-if="!props.selectingUsers"
        class="rounded-lg chip font-weight-medium"
        :color="chipData.color"
        >{{ chipData.title }}</v-chip
      >
    </v-card-item>
    <v-card-actions>
      <v-btn
        @click="unassignUser"
        icon="mdi-delete-outline"
        v-if="!props.preventUserDeleting"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, onBeforeMount, reactive} from "vue";
import UserAvatar from "@/components/settings/users/UserAvatar.vue";

const emit = defineEmits(["assignedUserChange"]);

const props = defineProps([
  "userInfo",
  "preventUserDeleting",
  "selectingUsers",
]);

const fullName = computed(() => {
  return props.userInfo.firstName + " " + props.userInfo.lastName;
});

let chipData = reactive({});
const role = (roleValue) => {
  switch (roleValue) {
    case 3:
      chipData = {
        title: "Admin",
        color: "error",
      };
      break;
    case 2:
      chipData = {
        title: "Manager",
        color: "green",
      };
      break;
    case 1:
      chipData = {
        title: "Employee",
        color: "blue",
      };
      break;
  }
};

onBeforeMount(() => {
  role(props.userInfo.role);
});

const unassignUser = () => {
  emit('unassignUser', props.userInfo);
}

const handleCheckboxClick = () => {
  emit('assignUser', props.userInfo);
}
</script>

<style scoped lang="scss">
.user-card {
  min-height: 88px;
  max-height: 88px;
}

.chip {
  min-width: 50px;
  min-height: 24px;
  border: 1px solid;
}

.chip-assigning-user {
  border: 1px solid;
  height: 20px;
}

.select-user {
  max-width: 100px;
}
</style>

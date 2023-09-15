<template>
  <v-avatar class="mx-2 my-2" :color="avatarColor" v-if="userInfo">
    <v-btn class="text-body-2 font-weight-medium bg-transparent text-uppercase">{{ userInitials }}</v-btn>
  </v-avatar>
</template>

<script setup>
import {computed, reactive, onMounted, ref, onBeforeMount} from "vue";
import {useStore} from "vuex";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  }
})

const store = useStore();

const userInfo = computed(() => props.user);

const userInitials = computed(() => {
  return userInfo.value.firstName ? userInfo.value.firstName.charAt(0) + userInfo.value.lastName.charAt(0) : '';
});

const avatarColor = computed(() => {
  return userInfo && userInfo.value.role === 3 ? 'red' : userInfo.value.role === 2 ? 'green' : userInfo.value.role === 1 ? 'blue' : 'black'
});
</script>

<style scoped></style>

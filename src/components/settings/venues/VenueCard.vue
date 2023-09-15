<template>
  <v-card
    class="elevation-0 user-card w-100 h-100 rounded-lg d-flex align-center"
    border
    color="#FBFCFC"
    v-if="props.venueData"
  >
    <v-icon icon="mdi-map-marker-radius-outline mx-4" color="astraNavColor"></v-icon>
    <v-card-item
      class="d-flex flex-column align-start px-0"
    >
      <div class="d-flex align-start flex-column justify-center">
        <div class="text-body-1 font-weight-medium mb-1">{{ props.venueData.name }}</div>
        <div class="text-body-2 d-flex text-capitalize">
          <div class="d-flex mx-2 ml-0"><div class="text-astraGray pr-1">Country:</div> {{props.venueData.country}}</div>
          <div class="d-flex mx-2"><div class="text-astraGray pr-1">Area:</div> {{props.venueData.area.name}}</div>
          <div class="d-flex mx-2"><div class="text-astraGray pr-1">City:</div> {{props.venueData.city}}</div>
        </div>
      </div>
    </v-card-item>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-btn
        @click="unAssignVenue"
        icon="mdi-delete-outline"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>

const props = defineProps({
  venueData: {
    required: true,
    type: Array
  }
});

const emit = defineEmits(["unAssignVenue"]);

const unAssignVenue = () => {
  emit('unAssignVenue');
}

</script>

<style scoped lang="scss">

</style>

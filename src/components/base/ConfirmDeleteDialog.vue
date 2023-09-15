<template>
  <v-dialog v-model="props.open">
    <v-sheet :width="400" :height="227" class="confirm-delete-card mx-auto rounded-lg elevation-0">
      <v-card-title class="text-body-1 py-5 bg-navy100 d-flex justify-space-between" :icon="'mdi-window-close'">Confirm delete
      <v-icon class="close-modal" icon="mdi-window-close" @click="closeModal"></v-icon></v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle class="text-body-1 py-8 text-center">Are you sure you want to delete the record ?</v-card-subtitle>
      <div class="w-100 d-flex align-center justify-center">
      <v-btn variant="outlined" class="mx-2 px-5 confirm-btn" color="error" @click="closeModal">CANCEL</v-btn>
      <v-btn variant="flat" class="mx-2 px-5 confirm-btn" :loading="props.loading" color="astraActiveNav">
        <div class="text-white" @click="confirmDelete">CONFIRM</div></v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
const props = defineProps([
  'id',
  'open',
  'loading'
])

const emit = defineEmits(["confirmDelete"]);

const confirmDelete = () => {
    emit("confirmDelete", props.id);
}

const closeModal = () => {
  emit('closeModal');
}

</script>

<style scoped>
.confirm-delete-card {
  max-width: 500px;
  width: 100%;
}

.confirm-btn {
  min-width: 83px;
  min-height: 48px;
  border-radius: 8px;
}
</style>

<template>
  <div style="display: flex; gap: 16px; flex-direction: column">
    <div v-if="recentFolder">
      <button @click="selectPreviousFolder" style="margin-right: 16px">
        Open previous folder
      </button>
      {{ recentFolder }}
    </div>
    <button @click="selectFolder" style="margin-left: 16px">
      Select icons folder
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["select", "selectPreviousFolder"]);

const recentFolder = ref(null);

onMounted(async () => {
  recentFolder.value = await window.fsAPI.retrieveRecentFolderPath();
});
const selectFolder = () => {
  emit("select");
};
const selectPreviousFolder = () => {
  emit("selectPreviousFolder");
};
</script>

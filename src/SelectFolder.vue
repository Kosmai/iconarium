<template>
  <div style="display: flex; gap: 16px; flex-direction: column">
    <div style="display: flex; align-items: center" v-if="recentFolder">
      <ButtonComponent
        @click="selectPreviousFolder"
        style="width: 150px; margin-right: 16px"
      >
        Open previous folder
      </ButtonComponent>
      <div>{{ recentFolder }}</div>
    </div>
    <ButtonComponent @click="selectFolder">
      Select icons folder
    </ButtonComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ButtonComponent from "./components/ButtonComponent.vue";

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

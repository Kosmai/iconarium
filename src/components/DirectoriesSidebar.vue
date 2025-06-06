<template>
  <div class="sidebar">
    <SidebarItem
      v-for="(item, index) in directoryStructure"
      :key="index"
      :item="item"
      :selectedDirectory="selectedDirectory"
      :expand="false"
      @select="directorySelected"
    />
  </div>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue";
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["directory-selected"]);

const props = defineProps({
  directoryStructure: {
    type: Object,
    required: true,
  },
  selectedDirectory: {
    type: String,
    default: null,
  },
});

const directorySelected = (event) => {
  emit("directory-selected", event);
};
</script>

<style scoped>
.sidebar {
  width: 500px;
  border-right: 1px solid #f0f0f054;
  padding: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
  gap: 8px;
  overflow-y: auto;
  height: 100%;
}
</style>

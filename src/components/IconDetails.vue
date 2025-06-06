<template>
  <div class="details-sidebar">
    <div class="sidebar-toggle-container">
      <button @click="collapseSidebar()" class="sidebar-toggle">
        <img
          src="../assets/sidebar-collapse.svg"
          class="sidebar-toggle-icon"
          alt="Toggle left sidebar"
          :style="{ transform: collapsed ? 'none' : 'rotate(180deg)' }"
        />
      </button>
    </div>
    <div v-if="!collapsed" class="details-sidebar-content">
      <div class="icon-container">
        <img :src="item.url" :alt="item.name" class="icon" />
      </div>
      <div class="details">
        <div class="details-row">
          <span class="label">Name:</span>
          <span class="value">{{ item.name }}</span>
        </div>
        <div v-if="item.size" class="details-row">
          <span class="label">Size:</span>
          <span class="value">{{ formatFileSize(item.size) }}</span>
        </div>
        <div v-if="item.lastAccessedTime" class="details-row">
          <span class="label">Accessed:</span>
          <span class="value">{{ formatTime(item.lastAccessedTime) }}</span>
        </div>
        <div v-if="item.modifiedTime" class="details-row">
          <span class="label">Modified:</span>
          <span class="value">{{ formatTime(item.modifiedTime) }}</span>
        </div>
        <div v-if="item.createdTime" class="details-row">
          <span class="label">Created:</span>
          <span class="value">{{ formatTime(item.createdTime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { formatFileSize, formatTime } from "../utils/formattingUtils";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const collapsed = ref(false);

const collapseSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style>
.details-sidebar {
  width: fit-content;
  padding-top: 8px;
}

.details-sidebar-content {
  width: max-content;
  max-width: 230px;
  padding-left: 8px;
}

.sidebar-toggle-container {
  display: flex;
  justify-content: flex-end;
}

.sidebar-toggle {
  background: darkslategrey;
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  margin-bottom: 8px;
}

.sidebar-toggle:hover {
  background-color: #607e7e;
}

.sidebar-toggle-icon {
  width: 25px;
  height: 25px;
}

.icon-container {
  margin: 20px auto;
  width: 100%;
  max-width: 250px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f054;
}

.icon {
  width: 100%;
  max-height: 150px;
  object-fit: contain;
}

.details {
  width: 100%;
}

.details-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 15px;
  line-height: 1.4;
}

.label {
  flex: 0 0 90px;
  color: #ffffffa9;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #ffffff80;
  word-break: break-word;
}
</style>

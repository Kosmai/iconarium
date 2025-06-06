<template>
  <div class="sidebar">
    <button @click="collapseSidebar()" class="sidebar-toggle">
      <img
        src="../assets/sidebar-collapse.svg"
        class="sidebar-toggle-icon"
        alt="Toggle left sidebar"
        :style="{ transform: collapsed ? 'rotate(180deg)' : 'none' }"
      />
    </button>
    <div v-if="!collapsed" class="sidebar-content">
      <SidebarItem
        v-for="(item, index) in directoryStructure"
        :key="index"
        :item="item"
        :selectedDirectory="selectedDirectory"
        :expand="true"
        @select="directorySelected"
      />
    </div>
  </div>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue";
import { ref, defineEmits, defineProps } from "vue";

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

const collapsed = ref(false);

const collapseSidebar = () => {
  collapsed.value = !collapsed.value;
};

const directorySelected = (event) => {
  emit("directory-selected", event);
};
</script>

<style scoped>
.sidebar-content {
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

.sidebar-toggle {
  background: darkslategrey;
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  margin-bottom: 8px;
  float: left;
}

.sidebar-toggle:hover {
  background-color: #607e7e;
}

.sidebar-toggle-icon {
  width: 25px;
  height: 25px;
}

.sidebar {
  width: fit-content;
  padding-top: 8px;
}
</style>

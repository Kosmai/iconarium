<template>
  <div
    v-if="!item.isFile"
    @click="toggle()"
    @dblclick="toggleExpand()"
    class="directory-container"
    :class="{ highlight: isHighlighted }"
  >
    <img
      v-if="hasChildDirectories"
      @click.stop="toggleExpand()"
      src="../assets/down-arrow.svg"
      class="expand-icon"
      alt="Expand Directory"
      :style="{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }"
    />
    <div
      class="directory-name"
      :class="{ 'without-expand': !hasChildDirectories }"
    >
      {{ item.name }}
    </div>
  </div>
  <div v-if="hasChildDirectories && isExpanded" class="nested">
    <SidebarItem
      v-for="child in item.children"
      :key="child.name"
      :item="child"
      :selectedDirectory="selectedDirectory"
      :expand="false"
      @select="toggle"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import SidebarItem from "./SidebarItem.vue";

const emit = defineEmits(["select"]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  selectedDirectory: {
    type: String,
    default: null,
  },
  expand: {
    type: Boolean,
    default: true,
  },
});

watch(
  () => props.expand,
  (newVal) => {
    isExpanded.value = newVal;
  },
);

const toggle = (event = null) => {
  emit("select", event ? event : props.item.path);
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const isExpanded = ref(props.expand);

const isHighlighted = computed(() => {
  return props.item.path === props.selectedDirectory;
});

const hasChildDirectories = computed(() => {
  return (
    props.item.children && props.item.children.some((child) => !child.isFile)
  );
});
</script>

<style scoped>
.directory-container {
  cursor: pointer;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 6px;
  border-radius: 2px;
  width: 100%;
  padding-right: 12px;
}
.nested {
  width: 250px;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
}
.highlight {
  background-color: #607e7e;
}
.directory-name {
  white-space: nowrap;
  user-select: none;
}
.directory-name.without-expand {
  padding-left: 20px;
}
.expand-icon {
  user-select: none;
  padding: 4px;
  width: 12px;
  height: 12px;
  transition: transform 0.15s ease;
}
</style>

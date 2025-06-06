<template>
  <div
    v-if="!item.isFile"
    @click="toggle()"
    class="directory-container"
    :class="{ highlight: isHighlighted }"
  >
    <button
      v-if="hasChildDirectories"
      @click.stop="toggleExpand()"
      class="expand-button"
    >
      <img
        src="../assets/down-arrow.svg"
        class="expand-icon"
        alt="Expand Directory"
        :style="{ transform: isExpanded ? 'rotate(180deg)' : 'none' }"
      />
    </button>
    <div class="directory-name">{{ item.name }}</div>
    <span class="image-count-tag">{{ fileCountLabel }}</span>
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

const toggle = (event) => {
  emit("select", event ? event : props.item.path);
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  console.log(props.item.children);
};

const directFileCount = ref(
  props.item?.children?.filter((child) => child.isFile).length ?? 0,
);

const isExpanded = ref(props.expand);

const isHighlighted = computed(() => {
  if (!props.selectedDirectory) {
    return false;
  }
  return props.item.path === props.selectedDirectory;
});

const fileCountLabel = computed(() => {
  if (directFileCount.value === 0) {
    return "no icons";
  }
  return `${directFileCount.value} icon${directFileCount.value > 1 ? "s" : ""}`;
});

const hasChildDirectories = computed(() => {
  return (
    props.item.children && props.item.children.some((child) => !child.isFile)
  );
});
</script>

<style scoped>
.directory-container {
  background-color: darkslategrey;
  cursor: pointer;
  padding: 4px;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 6px;
  border: 1px solid darkslategrey;
  border-radius: 4px;
  width: fit-content;
}
.nested {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 16px;
}
.image-count-tag {
  border: 1px solid gray;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  padding: 3px;
  background-color: #242424;
  white-space: nowrap;
}
.highlight {
  background-color: #607e7e;
}
.directory-name {
  white-space: nowrap;
}
.parent-path {
  color: gray;
}
.highlight-parent {
  color: darkslategrey;
}
.expand-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.expand-icon {
  width: 15px;
  height: 15px;
  transition: transform 0.15s ease;
}
</style>

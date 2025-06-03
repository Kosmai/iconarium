<template>
  <div
    v-if="!item.isFile"
    @click="toggle()"
    class="directory-label"
    :class="{ 'has-children': item.children, highlight: isHighlighted }"
  >
    <span :class="{ 'parent-path': true, 'highlight-parent': isHighlighted }">{{
      item.parentPath
    }}</span
    >/{{ item.name }}
    <span class="image-count-tag">{{ fileCountLabel }}</span>
  </div>

  <div v-if="item.children" class="nested">
    <SidebarItem
      v-for="child in item.children"
      :key="child.name"
      :item="child"
      :selectedDirectory="selectedDirectory"
      @select="toggle"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
});

const toggle = (event) => {
  emit("select", event ? event : props.item.path);
};

const directFileCount = ref(
  props.item?.children?.filter((child) => child.isFile).length ?? 0,
);

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
</script>

<style scoped>
.directory-label {
  cursor: pointer;
  padding: 4px;
  user-select: none;
  align-items: center;
  display: flex;
  border: 1px solid darkslategrey;
  border-radius: 4px;
  width: 250px;
}
.has-children {
  background-color: darkslategrey;
  border-radius: 4px;
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
  margin-left: 8px;
}
.highlight {
  background-color: #607e7e;
}
.parent-path {
  color: gray;
}
.highlight-parent {
  color: darkslategrey;
}
</style>

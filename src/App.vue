<template>
  <div v-if="iconsToRender.length" class="app-container">
    <!-- Top bar: Search + Filters -->
    <div class="top-bar">
      <div class="filters">
        <div @click="resetFilters">Clear filters</div>
        <label>
          <select v-model="iconFilters.extension">
            <option value="">All formats</option>
            <option value=".svg">SVG</option>
            <option value=".png">PNG</option>
          </select>
        </label>
      </div>
      <input
        v-model="iconFilters.search"
        type="text"
        placeholder="Search..."
        class="search-input"
      />
    </div>

    <!-- Layout: Sidebar + Main -->
    <div class="main-layout">
      <div class="sidebar">
        <SidebarItem
          v-for="(item, index) in icons"
          :key="index"
          :item="item"
          :selectedFolder="iconFilters.folder"
          @select-category="folderSelected"
        />
      </div>
      <div class="main-content">
        <IconItem
          v-for="icon in iconsToRender"
          :key="icon.name"
          :item="icon"
          :filters="iconFilters"
          :selected-item="selectedIcon"
          @select-item="itemSelected"
        />
      </div>
      <div v-if="selectedIcon" class="icon-details">
        <IconDetails :item="selectedIcon" />
      </div>
    </div>
  </div>
  <SelectFolder v-else @click="loadIcons" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import SidebarItem from "./components/SidebarItem.vue";
import IconItem from "./components/IconItem.vue";
import SelectFolder from "./SelectFolder.vue";
import IconDetails from "./components/IconDetails.vue";

const iconFilters = ref({
  folder: null,
  extension: "",
  search: "",
});

const icons = ref([]);
const iconsToRender = ref([]);
const selectedIcon = ref();

onMounted(async () => {
  // icons.value = await window.fsAPI.readIcons();
  // console.log(icons.value);
  // iconsToRender.value = filterFiles(icons.value);
});

const loadIcons = async () => {
  icons.value = await window.fsAPI.readIcons();
  console.log(icons.value);
  iconsToRender.value = filterFiles(icons.value);
};

const folderSelected = (event) => {
  iconFilters.value.folder = event;
};

const itemSelected = (event) => {
  selectedIcon.value = event;
};

const resetFilters = () => {
  iconFilters.value = {
    folder: null,
    extension: "",
    search: "",
  };
};

const filterFiles = (structure) => {
  let result = [];

  Object.keys(structure).forEach((key) => {
    const item = structure[key];

    if (item.isFile) {
      result.push(item); // Keep the file
    } else if (item.children) {
      const filteredChildren = filterFiles(item.children); // Recursively filter children
      if (Object.keys(filteredChildren).length > 0) {
        result = result.concat(filteredChildren);
      }
    }
  });

  return result;
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  height: 80vh;
  width: 80vw;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 1rem;
  border-bottom: 1px solid #ccc;
}

.search-input {
  flex-grow: 1;
  padding: 6px 10px;
  font-size: 1rem;
}

.filters {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 500px;
  border-right: 1px solid #ccc;
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
}

.sidebar li {
  padding: 6px 0;
  cursor: pointer;
  width: 100%;
}

.main-content {
  display: grid;
  padding: 20px;
  width: 100%;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: auto;
}

.sidebar,
.main-content {
  overflow-y: auto;
  height: 100%;
}

.icon-details {
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 100%;
  max-width: 280px;
}
</style>

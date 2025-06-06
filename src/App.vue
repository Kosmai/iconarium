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
      <p class="items-metric">{{ iconsToRender.length }} items</p>
    </div>

    <!-- Layout: Sidebar + Main -->
    <div class="main-layout">
      <DirectoriesSidebar
        :directoryStructure="icons"
        :selectedDirectory="iconFilters.folder"
        @directory-selected="directorySelected"
      />
      <div class="main-content">
        <IconItem
          v-for="icon in iconsToRender"
          :key="icon.name"
          :item="icon"
          :filters="iconFilters"
          :selected-items="selectedItems"
          @select-single="selectItem($event, false)"
          @select-multiple="selectItem($event, true)"
        />
      </div>
      <div class="icon-details" v-if="Object.keys(selectedItems).length">
        <IconDetails
          v-if="Object.keys(selectedItems).length === 1"
          :item="Object.values(selectedItems)[0]"
        />
        <IconDetailsMultiple v-else :items="selectedItems" />
      </div>
    </div>
  </div>
  <SelectFolder
    v-else
    @select="loadIcons"
    @selectPreviousFolder="loadIcons(false)"
  />
</template>

<script setup>
import { ref } from "vue";
import IconItem from "./components/IconItem.vue";
import SelectFolder from "./SelectFolder.vue";
import IconDetails from "./components/IconDetails.vue";
import DirectoriesSidebar from "./components/DirectoriesSidebar.vue";
import IconDetailsMultiple from "./components/IconDetailsMultiple.vue";

const iconFilters = ref({
  folder: null,
  extension: "",
  search: "",
});

const icons = ref([]);
const iconsToRender = ref([]);
const selectedItems = ref({});

const loadIcons = async (withFolderSelection = true) => {
  icons.value = await window.fsAPI.readIcons(withFolderSelection);
  iconsToRender.value = filterFiles(icons.value);
  console.log(icons.value);
};

const directorySelected = (event) => {
  iconFilters.value.folder = event;
};

const selectItem = (event, multipleSelection) => {
  if (!multipleSelection) {
    selectedItems.value = {}; // Single selection, clear previous selections
  }
  if (selectedItems.value[event.url]) {
    // If the item is already selected, toggle it off
    delete selectedItems.value[event.url];
    return;
  }
  selectedItems.value[event.url] = event;
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

.main-content {
  display: grid;
  padding: 20px;
  width: 100%;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: auto;
  overflow-y: auto;
  height: fit-content;
}

.icon-details {
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 100%;
  max-width: 280px;
}
</style>

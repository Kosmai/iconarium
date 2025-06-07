<template>
  <div v-if="itemsToRenderCount" class="app-container">
    <div class="main-layout">
      <DirectoriesSidebar
        :directoryStructure="items"
        :selectedDirectory="filters.folder"
        @directory-selected="directorySelected"
      />
      <div class="main-view">
        <TopBar
          :icon-filters="filters"
          :total-icons="itemsToRenderCount"
          @clear-filters="initializeFilters"
        />
        <div class="main-content">
          <IconItem
            v-for="icon in itemsToRender"
            :key="icon.name"
            :item="icon"
            :filters="filters"
            :selected-items="selectedItems"
            @select-single="selectItem($event, false)"
            @select-multiple="selectItem($event, true)"
          />
        </div>
      </div>
      <div class="icon-details" v-if="selectedItemsCount">
        <IconDetails
          v-if="selectedItemsCount === 1"
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
import { computed, ref } from "vue";
import IconItem from "./components/IconItem.vue";
import SelectFolder from "./SelectFolder.vue";
import IconDetails from "./components/IconDetails.vue";
import DirectoriesSidebar from "./components/DirectoriesSidebar.vue";
import IconDetailsMultiple from "./components/IconDetailsMultiple.vue";
import TopBar from "./components/TopBar.vue";

const filters = ref({});
const items = ref([]);
const itemsToRender = ref([]);
const selectedItems = ref({});

const initializeFilters = () => {
  filters.value = {
    folder: null,
    extension: "",
    search: "",
  };
};

initializeFilters();

const itemsToRenderCount = computed(() => {
  return itemsToRender.value.length;
});

const selectedItemsCount = computed(() => {
  return Object.keys(selectedItems.value).length;
});

const loadIcons = async (withFolderSelection = true) => {
  items.value = await window.fsAPI.readIcons(withFolderSelection);
  itemsToRender.value = filterFiles(items.value);
  console.log(items.value);
};

const directorySelected = (event) => {
  filters.value.folder = event;
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
  width: 95vw;
}

.main-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.main-view {
  width: 100%;
  height: fit-content;
  padding: 20px;
}

.main-content {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: auto;
  overflow-y: auto;
}

.icon-details {
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 100%;
  max-width: 280px;
}
</style>

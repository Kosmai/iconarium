<template>
  <div v-if="iconsToRender.length" class="app-container">
    <!-- Top bar: Search + Filters -->
    <div class="top-bar">
      <div class="filters">
        <div @click="resetFilters">
          Clear filters
        </div>
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
        />
      </div>
    </div>
  </div>
  <SelectFolder
    v-else
    @click="loadIcons"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DirectoriesSidebar from './components/DirectoriesSidebar.vue';
import IconItem from './components/IconItem.vue';
import SelectFolder from './SelectFolder.vue';

const iconFilters = ref({
  folder: null,
  extension: '',
  search: '',
})

const icons = ref([]);
const iconsToRender = ref([]);

const loadIcons = async () => {
  icons.value = await window.fsAPI.readIcons();
  console.log(icons.value);
  iconsToRender.value = filterFiles(icons.value);
}

const directorySelected = (event) => {
  iconFilters.value.folder = event;
}

const resetFilters = () => {
  iconFilters.value = {
    folder: null,
    extension: '',
    search: '',
  }
}

const filterFiles = (structure) => {
  let result = [];

  Object.keys(structure).forEach((key) => {
    const item = structure[key];

    if (item.isFile) {
      result.push(item);  // Keep the file
    } else if (item.children) {
      const filteredChildren = filterFiles(item.children);  // Recursively filter children
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

.main-content {
  display: grid;
  padding: 20px;
  width: 100%;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: auto;
  overflow-y: auto;
  height: 100%;
}

</style>

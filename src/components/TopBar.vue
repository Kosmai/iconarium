<template>
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
    <p class="items-metric">{{ totalIcons }} items</p>
  </div>
</template>

<script setup>
defineProps({
  iconFilters: {
    type: Object,
    required: true,
  },
  totalIcons: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["reset-filters"]);

const resetFilters = () => {
  emit("reset-filters");
};
</script>

<style scoped>
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
</style>

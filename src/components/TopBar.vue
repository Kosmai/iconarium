<template>
  <div class="top-bar">
    <input
      v-model="iconFilters.search"
      type="text"
      placeholder="Search..."
      class="search-input"
    />
    <div class="filters">
      <label>
        <select v-model="iconFilters.extension">
          <option v-for="option in extensionOptions" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        <select v-model="iconFilters.tag">
          <option v-for="option in tagOptions" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <ButtonComponent label="Clear" icon="clear.svg" @click="clearFilters" />
      <div class="items-metric">{{ totalIcons }} items</div>
    </div>
  </div>
</template>

<script setup>
import ButtonComponent from "./ButtonComponent.vue";

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

const emit = defineEmits(["clear-filters"]);

const extensionOptions = [
  { value: "", label: "All formats" },
  { value: ".svg", label: "SVG" },
  { value: ".png", label: "PNG" },
];

const tagOptions = [
  { value: null, label: "All tags" },
  { value: "cool", label: "cool" },
];

const clearFilters = () => {
  emit("clear-filters");
};
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.search-input {
  padding: 6px 10px;
  font-size: 1rem;
  height: 16px;
  width: 400px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 1rem;
}
select {
  height: 32px;
}
</style>

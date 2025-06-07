<template>
  <button>
    <img
      v-if="icon"
      :src="`/src/assets/${icon}`"
      class="button-icon"
      width="24px"
    />
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  icon: {
    // The relative path to the icon image inside the assets folder
    type: String,
    default: null,
  },
});
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 8px;
  padding-left: 8px;
  height: 32px;
  background-color: #30303b;
  border: 1px solid #f0f0f054;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>

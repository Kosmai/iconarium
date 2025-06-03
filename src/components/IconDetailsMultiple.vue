<template>
  <div class="icon-container">
    <span class="big-number">{{ itemsCount }}</span>
    <span>items selected</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
});

const itemsCount = computed(() => Object.keys(props.items).length);
</script>

<style>
.icon-container {
  margin: 20px auto;
  width: 100%;
  max-width: 250px;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 8px;
}
.big-number {
  font-size: 48px;
}
</style>

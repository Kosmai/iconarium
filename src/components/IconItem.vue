<template>
    <div v-if="shouldShowItem" @click="copyItem" class="icon-container" :style="`background-image: url(${item.url});`">
        <div>{{ item.name }}</div>
    </div>
</template>


<script setup>

import { ref, computed } from 'vue';

const props = defineProps({
  item: {
      type: Object,
      required: true
  },
  filters: {
    type: Object,
    required: false,
  }
});

const showPopup = ref(false);

const copyItem = () => {
    navigator.clipboard.writeText(`${props.item.parentPath}/${props.item.name}`);
}

const shouldShowItem = computed(()=> {
    if (props.filters.extension && (props.filters.extension !== props.item.extension)) {
        return false;
    }
    if (props.filters.folder && (props.filters.folder !== props.item.parentPath)) {
        return false;
    }
    if (props.filters.search && !props.item.name.includes(props.filters.search)) {
        return false;
    }
    return true;
});

</script>

<style scoped>
.icon-container {
    border-radius: 4px;
    background-color: darkslategrey;
    width: 150px;
    height: 150px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
}
.popup {
  position: relative;
  margin-left: 8px;

  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
</style>

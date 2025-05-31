<template>
    <div v-if="shouldShowItem" @click="selectItem()" @click.right="copyItem()" class="icon-container" :class="{'highlight': isHighlighted}" :style="`background-image: url(${item.url});`">
        <div>{{ item.name }}</div>
    </div>
</template>


<script setup>

import { ref, computed } from 'vue';

const emit = defineEmits(['select-item']);

const props = defineProps({
  item: {
      type: Object,
      required: true
  },
  filters: {
    type: Object,
    required: false,
  },
  selectedItem: {
    type: String,
    default: null,
  }
});

const showPopup = ref(false);

const selectItem = (event) => {
    emit('select-item', event ? event : props.item.url);
}

const isHighlighted = computed(() => {
    if (!props.selectedItem) {
      return false;
    }
    return props.item.url === props.selectedItem;
});

const copyItem = () => {
    console.log('Copied file');
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
.highlight {
    outline-color: #aa9770;
    outline-style: solid;
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

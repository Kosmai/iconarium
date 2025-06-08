<template>
  <div
    @click="selectItem"
    @click.right="selectAndCopy"
    class="icon-container"
    :class="{ highlight: isHighlighted }"
    :style="`background-image: url(${item.url});`"
  >
    <div>{{ item.name }}</div>
    <div v-if="showCopiedFeedback" class="copied-feedback">Copied!</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCopyItem } from "../composables/useCopyItem.js";

const emit = defineEmits(["select-single", "select-multiple"]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  filters: {
    type: Object,
    required: false,
  },
  selectedItems: {
    type: Object,
    default: null,
  },
});

const { copyItem, showCopiedFeedback } = useCopyItem();

const selectItem = (event) => {
  if (event.ctrlKey || event.metaKey) {
    emit("select-multiple", props.item);
    return;
  }
  emit("select-single", props.item);
};

const isHighlighted = computed(() => {
  return props.selectedItems[props.item.url] ?? false;
});

const selectAndCopy = (event) => {
  selectItem(event);
  copyItem(props.item);
};
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
  position: relative;
}
.highlight {
  outline: solid #aa9770;
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

.copied-feedback {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #aa9770;
  color: black;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 15px;
  z-index: 2;
  animation: fadeInOut 1s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.95;
  }
  80% {
    opacity: 0.95;
  }
  100% {
    opacity: 0;
  }
}
</style>

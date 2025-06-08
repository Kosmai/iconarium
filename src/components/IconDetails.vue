<template>
  <div class="icon-container">
    <img
      :src="item.url"
      :alt="item.name"
      class="icon"
      @click="showEnlargedImage"
      style="cursor: zoom-in"
    />
  </div>
  <div class="details">
    <div class="details-row">
      <span class="label">Name:</span>
      <span class="value">{{ item.name }}</span>
      <img
        src="../assets/clipboard.svg"
        width="20px"
        alt="Copy"
        style="cursor: pointer"
        @click="copyValue(item.name)"
      />
    </div>
    <div class="details-row">
      <span class="label">Path:</span>
      <span class="value">{{ path }}</span>
      <img
        src="../assets/clipboard.svg"
        width="20px"
        alt="Copy"
        style="cursor: pointer"
        @click="copyValue(path)"
      />
    </div>
    <div v-if="item.size" class="details-row">
      <span class="label">Size:</span>
      <span class="value">{{ formatFileSize(item.size) }}</span>
    </div>
    <div v-if="item.lastAccessedTime" class="details-row">
      <span class="label">Accessed:</span>
      <span class="value">{{ formatTime(item.lastAccessedTime) }}</span>
    </div>
    <div v-if="item.modifiedTime" class="details-row">
      <span class="label">Modified:</span>
      <span class="value">{{ formatTime(item.modifiedTime) }}</span>
    </div>
    <div v-if="item.createdTime" class="details-row">
      <span class="label">Created:</span>
      <span class="value">{{ formatTime(item.createdTime) }}</span>
    </div>
    <div class="tags">
      <div class="tag" v-for="tag in tags">
        {{ tag }}
        <img
          src="../assets/clear.svg"
          width="20px"
          alt="Remove tag"
          style="cursor: pointer"
          @click="removeTag(tag)"
        />
      </div>
      <ButtonComponent icon="plus.svg" label="Add tag" @click="addTagClicked" />
      <input
        v-if="showAddTagPopup"
        ref="addTagPopup"
        type="text"
        placeholder="Enter tag name"
        @keyup.enter="addTagConfirm($event.target.value)"
        @keyup.esc="showAddTagPopup = false"
        @blur="showAddTagPopup = false"
        class="tag-input"
      />
    </div>
  </div>
  <div class="actions">
    <div class="actions-item">
      <span v-if="showCopiedFeedback"> Copied! </span>
    </div>
  </div>
</template>

<script setup>
import { formatFileSize, formatTime } from "../utils/formattingUtils";
import { useCopyItem } from "../composables/useCopyItem.js";
import { computed, nextTick, ref } from "vue";
import { useTags } from "../composables/useTags.js";
import ButtonComponent from "./ButtonComponent.vue";

const emit = defineEmits(["enlarge-image"]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const path = computed(() => {
  return props.item.parentPath
    ? `${props.item.parentPath}/${props.item.name}`
    : props.item.name;
});

const iconName = computed(() => props.item.name);
const showAddTagPopup = ref(false);
const addTagPopup = ref(null);

const { copyValue, showCopiedFeedback } = useCopyItem();
const { tags, addTag, removeTag } = useTags(iconName);

const addTagConfirm = (tagName) => {
  addTag(tagName);
  showAddTagPopup.value = false;
};

const addTagClicked = () => {
  showAddTagPopup.value = true;
  nextTick(() => {
    if (addTagPopup.value) {
      addTagPopup.value.focus();
    }
  });
};

const showEnlargedImage = () => {
  emit("enlarge-image", props.item.url);
};
</script>

<style>
.icon-container {
  margin: 20px auto;
  width: 100%;
  max-width: 250px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f054;
}

.icon {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: contain;
}

.details {
  width: 100%;
}

.details-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 15px;
  line-height: 1.4;
}

.label {
  flex: 0 0 90px;
  color: #ffffffa9;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #ffffff80;
  word-break: break-word;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin: 12px;
}

.actions-item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.tag {
  background-color: #db5858;
  height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  width: fit-content;
  padding: 4px;
  border-radius: 4px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.tag-input {
  margin-top: 8px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #f0f0f054;
  background-color: #30303b;
  color: white;
  width: calc(100% - 8px);
}
</style>

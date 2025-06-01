<template>
    <div class="icon-container">
        <img :src="item.url" :alt="item.name" class="icon">
    </div>
    <div class="details">
        <div class="details-row">
            <span class="label">Name:</span>
            <span class="value">{{ item.name }}</span>
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
    </div>
</template>

<script setup>
import { formatFileSize, formatTime } from '../utils/formattingUtils';

const props = defineProps({
  item: {
      type: Object,
      required: true
  }
});

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

</style>
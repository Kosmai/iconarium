import { ref, watch } from "vue";

export function useTags(iconNameRef) {
  const tags = ref([]);
  const loadTags = async () => {
    try {
      tags.value = await window.tagAPI.getTags(iconNameRef.value);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const addTag = async (tag) => {
    try {
      await window.tagAPI.addTag(iconNameRef.value, tag);
      await loadTags();
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const removeTag = async (tag) => {
    try {
      await window.tagAPI.removeTag(iconNameRef.value, tag);
      await loadTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Load tags when the composable is initialized/input changes
  watch(
    iconNameRef,
    () => {
      loadTags();
    },
    { immediate: true },
  );

  return {
    tags,
    addTag,
    removeTag,
    loadTags,
    // getIconsByTag,
    // setTags,
  };
}

import { ref } from "vue";

export function useCopyItem() {
  const showCopiedFeedback = ref(false);

  function copyItem(item) {
    navigator.clipboard
      .writeText(`${item.parentPath}/${item.name}`)
      .then(() => {
        showCopiedFeedback.value = true;
        setTimeout(() => (showCopiedFeedback.value = false), 1000); // Hide after 1 second
      });
    return false;
  }

  function copyValue(value) {
    navigator.clipboard.writeText(value).then(() => {
      showCopiedFeedback.value = true;
      setTimeout(() => (showCopiedFeedback.value = false), 1000); // Hide after 1 second
    });
    return false;
  }

  // return what you want to expose
  return {
    showCopiedFeedback,
    copyItem,
    copyValue,
  };
}

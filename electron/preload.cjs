const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("fsAPI", {
  readIcons: async (withFolderSelection) => {
    try {
      const icons = await ipcRenderer.invoke("readIcons", withFolderSelection); // Use IPC to get the data
      return icons;
    } catch (error) {
      console.error("Error fetching icons:", error);
      return [];
    }
  },
  retrieveRecentFolderPath: async () => {
    try {
      const path = await ipcRenderer.invoke("retrieveRecentFolderPath");
      return path;
    } catch (error) {
      console.error("Error fetching folder path:", error);
      return [];
    }
  },
});

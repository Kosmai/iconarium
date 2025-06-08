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

contextBridge.exposeInMainWorld("tagAPI", {
  addTag: (icon, tag) => ipcRenderer.invoke("tags:add", icon, tag),
  removeTag: (icon, tag) => ipcRenderer.invoke("tags:remove", icon, tag),
  getTags: (icon) => ipcRenderer.invoke("tags:get", icon),
  getIconsByTag: (tag) => ipcRenderer.invoke("tags:getByTag", tag),
  setTags: (icon, tags) => ipcRenderer.invoke("tags:set", icon, tags),
  getAllTags: () => ipcRenderer.invoke("tags:getAll"),
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fsAPI', {
  readIcons: async () => {
    try {
      const icons = await ipcRenderer.invoke('read-icons');  // Use IPC to get the data
      return icons;
    } catch (error) {
      console.error('Error fetching icons:', error);
      return [];
    }
  },
  appRoot: async () => await ipcRenderer.invoke('get-icon-root'),
});
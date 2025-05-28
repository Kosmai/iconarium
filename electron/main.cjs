const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const iconDir = path.resolve(__dirname, '../icons');

const getDirectoryStructure = (dir) => {
  const items = fs.readdirSync(dir);  // Get all items in the directory
  const result = [];

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      result.push({
        isFile: false,
        name: item,
        path: path.relative(iconDir, itemPath),
        parentPath: path.relative(iconDir, dir),
        children: getDirectoryStructure(itemPath)
      });
    } else if (stat.isFile()) {
      result.push({
        isFile: true,
        name: item,
        extension: path.extname(item),
        parentPath: path.relative(iconDir, dir),
        size: stat.size,
        url: `file://${itemPath}`,
      });
    }
  });

  return result;
};


ipcMain.handle('get-icon-root', () => {
  return iconDir;
});

ipcMain.handle('read-icons', () => {
  try {
    const structure = getDirectoryStructure(iconDir);
    return structure;
  } catch (error) {
    return { error: error.message };
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      webSecurity: false,
    }
  });

  win.loadURL('http://localhost:5173'); // assuming Vite dev server
}

app.whenReady().then(createWindow);
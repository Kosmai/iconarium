const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  clipboard,
  nativeImage,
} = require("electron");
const Store = require("electron-store").default;
const path = require("path");
const fs = require("fs");

const tagManager = require("./tagManager.cjs");

const ALLOWED_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico"];
const store = new Store();

async function openFolderDialog() {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    modal: true,
  });

  if (!result.canceled) {
    console.log("Selected folder:", result.filePaths[0]);
    store.set("recentFolderPath", result.filePaths[0]);
    return result.filePaths[0];
  }
}

const getDirectoryStructureRec = (rootDirectory, currentDirectory) => {
  const items = fs.readdirSync(currentDirectory); // Get all items in the directory
  const result = [];

  items.forEach((item) => {
    const itemPath = path.join(currentDirectory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      result.push({
        isFile: false,
        name: item,
        path: path.relative(rootDirectory, itemPath),
        parentPath: path.relative(rootDirectory, currentDirectory),
        children: getDirectoryStructureRec(rootDirectory, itemPath),
      });
    } else if (stat.isFile()) {
      const extension = path.extname(item);
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return;
      }
      result.push({
        isFile: true,
        name: item,
        extension: path.extname(item),
        parentPath: path.relative(rootDirectory, currentDirectory),
        size: stat.size,
        url: `file://${itemPath}`,
        lastAccessedTime: stat.atimeMs,
        modifiedTime: stat.mtimeMs,
        createdTime: stat.ctimeMs,
      });
    }
  });

  return result;
};

const getDirectoryStructure = (rootDirectory) => {
  const structure = getDirectoryStructureRec(rootDirectory, rootDirectory);
  return [
    {
      isFile: false,
      name: path.basename(rootDirectory),
      path: "",
      children: structure,
    },
  ];
};

function createWindow() {
  const win = new BrowserWindow({
    show: false, // hide until it's ready
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      webSecurity: false,
    },
  });

  win.maximize();
  win.show();
  win.loadURL("http://localhost:5173"); // assuming Vite dev server
}

// =====================================================================
//                          tagAPI Handlers
// =====================================================================

ipcMain.handle("tags:add", (e, iconName, tag) => {
  tagManager.addTag(iconName, tag);
});
ipcMain.handle("tags:remove", (e, iconName, tag) => {
  tagManager.removeTag(iconName, tag);
});
ipcMain.handle("tags:get", (e, iconName) => {
  return tagManager.getTags(iconName);
});
ipcMain.handle("tags:getByTag", (e, tag) => {
  return tagManager.getIconsByTag(tag);
});
ipcMain.handle("tags:set", (e, iconName, tags) => {
  tagManager.setTags(iconName, tags);
});
ipcMain.handle("tags:getAll", () => {
  return tagManager.getAllTags();
});

console.log("Current Electron Store data:", store.store);
app.whenReady().then(createWindow);

// =====================================================================
//                          fsAPI Handlers
// =====================================================================

ipcMain.handle("readIcons", async (event, withFolderSelection) => {
  try {
    const rootDirectory = withFolderSelection
      ? await openFolderDialog()
      : (store.get("recentFolderPath") ?? (await openFolderDialog()));
    return getDirectoryStructure(rootDirectory);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("retrieveRecentFolderPath", () => {
  return store.get("recentFolderPath") ?? null;
});

ipcMain.handle("copyImageToClipboard", async (event, imageUrl) => {
  try {
    // Convert file:// URL to path if needed
    const filePath = imageUrl.startsWith("file://")
      ? imageUrl.slice(7)
      : imageUrl;

    try {
      const image = nativeImage.createFromPath(filePath);
      if (!image.isEmpty()) {
        clipboard.writeImage(image);
        return true;
      }
    } catch (e) {
      throw new Error("Image is empty or invalid");
    }

    throw new Error("Unsupported image URL format");
  } catch (error) {
    console.error("Error copying image to clipboard:", error);
    throw error;
  }
});

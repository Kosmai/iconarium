// src/store/tagManager.js
const Store = require("electron-store").default;

const store = new Store();
const ICONS_KEY = "icons";

function loadIcons() {
  return store.get(ICONS_KEY, {});
}

const saveIcons = (icons) => {
  store.set(ICONS_KEY, icons);
};

function addTag(iconName, tag) {
  const icons = loadIcons();
  if (!icons[iconName]) {
    icons[iconName] = [];
  }
  if (!icons[iconName].includes(tag)) {
    icons[iconName].push(tag);
    saveIcons(icons);
  }
}

function removeTag(iconName, tag) {
  const icons = loadIcons();
  if (icons[iconName]) {
    icons[iconName] = icons[iconName].filter((t) => t !== tag);
    saveIcons(icons);
  }
}

function getTags(iconName) {
  const icons = loadIcons();
  return icons[iconName] || [];
}

function getIconsByTag(tag) {
  const icons = loadIcons();
  return Object.entries(icons)
    .filter(([_, tags]) => Array.isArray(tags) && tags.includes(tag))
    .map(([iconName]) => iconName);
}

function setTags(iconName, tags) {
  const icons = loadIcons();
  icons[iconName] = tags;
  saveIcons(icons);
}

function getAllTags() {
  const icons = loadIcons();
  const allTags = new Set();
  Object.values(icons).forEach((tags) => {
    if (Array.isArray(tags)) {
      tags.forEach((tag) => allTags.add(tag));
    }
  });
  return Array.from(allTags);
}

module.exports = {
  addTag,
  removeTag,
  getTags,
  getIconsByTag,
  setTags,
  getAllTags,
};

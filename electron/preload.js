const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('snappyAPI', {
  // Snippets CRUD & Storage
  loadSnippets: () => ipcRenderer.invoke('snippets:load'),
  saveSnippets: (snippets) => ipcRenderer.invoke('snippets:save', snippets),
  getStorageInfo: () => ipcRenderer.invoke('storage:get-info'),
  openStorageFolder: () => ipcRenderer.invoke('storage:open-folder'),
  exportBackup: () => ipcRenderer.invoke('storage:export-backup'),
  importBackup: () => ipcRenderer.invoke('storage:import-backup'),

  // Clipboard (Rich Zendesk HTML + Plain text fallback)
  copyRichText: (data) => ipcRenderer.invoke('clipboard:copy-rich', data),

  // Window Controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  setAlwaysOnTop: (flag) => ipcRenderer.invoke('window:set-always-on-top', flag),
  isAlwaysOnTop: () => ipcRenderer.invoke('window:is-always-on-top'),
  toggleCompactMode: (compact) => ipcRenderer.invoke('window:set-compact-mode', compact),

  // Events from Main Process
  onGlobalQuickSearch: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('quick-search-trigger', subscription);
    return () => ipcRenderer.removeListener('quick-search-trigger', subscription);
  },
  onWindowFocus: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('window-focus', subscription);
    return () => ipcRenderer.removeListener('window-focus', subscription);
  }
});

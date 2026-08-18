const { app, BrowserWindow, ipcMain, clipboard, shell, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let isCompact = false;
let isAlwaysOnTopState = false;

// Determine Documents directory storage path
function getStorageDirectory() {
  const documentsPath = app.getPath('documents');
  const dirPath = path.join(documentsPath, 'SnappyNotes');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

function getSnippetsFilePath() {
  return path.join(getStorageDirectory(), 'snippets.json');
}

// Initial snippets - empty by default (no dummy text)
const INITIAL_SNIPPETS = [];

function initLocalStorage() {
  try {
    const filePath = getSnippetsFilePath();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(INITIAL_SNIPPETS, null, 2), 'utf-8');
      console.log('Initialized clean snippets JSON at:', filePath);
    }
  } catch (err) {
    console.error('Failed to initialize local snippets file:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 420,
    minHeight: 480,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#f8fafc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true
    },
    icon: fs.existsSync(path.join(__dirname, '../build/icon.ico'))
      ? path.join(__dirname, '../build/icon.ico')
      : path.join(__dirname, '../public/icon.png')
  });

  const isDev = process.env.NODE_ENV === 'development';
  const distPath = path.join(__dirname, '../dist/index.html');

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      if (fs.existsSync(distPath)) {
        mainWindow.loadFile(distPath);
      }
    });
  } else {
    if (fs.existsSync(distPath)) {
      mainWindow.loadFile(distPath);
    } else {
      mainWindow.loadURL('http://localhost:5173');
    }
  }

  mainWindow.on('focus', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-focus');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('snippets:load', async () => {
  try {
    const filePath = getSnippetsFilePath();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(INITIAL_SNIPPETS, null, 2), 'utf-8');
      return INITIAL_SNIPPETS;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_SNIPPETS;
  } catch (error) {
    console.error('Error reading snippets file:', error);
    return INITIAL_SNIPPETS;
  }
});

ipcMain.handle('snippets:save', async (_, snippets) => {
  try {
    const filePath = getSnippetsFilePath();
    const tempPath = filePath + '.tmp';
    const jsonString = JSON.stringify(snippets, null, 2);
    fs.writeFileSync(tempPath, jsonString, 'utf-8');
    fs.renameSync(tempPath, filePath);
    return { success: true, count: snippets.length };
  } catch (error) {
    console.error('Error saving snippets:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('storage:get-info', async () => {
  const filePath = getSnippetsFilePath();
  const dirPath = getStorageDirectory();
  let fileSize = 0;
  let snippetCount = 0;
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      fileSize = stats.size;
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      snippetCount = Array.isArray(data) ? data.length : 0;
    }
  } catch (e) {}

  return {
    filePath,
    dirPath,
    fileSize,
    snippetCount
  };
});

ipcMain.handle('storage:open-folder', async () => {
  const dirPath = getStorageDirectory();
  await shell.openPath(dirPath);
  return true;
});

ipcMain.handle('storage:export-backup', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Export SnappyNotes Backup',
    defaultPath: `SnappyNotes_Backup_${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });

  if (canceled || !filePath) return { success: false };

  try {
    const currentFilePath = getSnippetsFilePath();
    const data = fs.readFileSync(currentFilePath, 'utf-8');
    fs.writeFileSync(filePath, data, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('storage:import-backup', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Import SnappyNotes Backup',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile']
  });

  if (canceled || filePaths.length === 0) return { success: false };

  try {
    const importPath = filePaths[0];
    const data = fs.readFileSync(importPath, 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid JSON format: Expected an array of snippets');
    }
    const currentFilePath = getSnippetsFilePath();
    fs.writeFileSync(currentFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
    return { success: true, snippets: parsed };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Zendesk-Compatible Rich Clipboard handler
ipcMain.handle('clipboard:copy-rich', async (_, { html, text }) => {
  try {
    clipboard.write({
      html: html || '',
      text: text || ''
    });
    return { success: true };
  } catch (error) {
    console.error('Clipboard write error:', error);
    return { success: false, error: error.message };
  }
});

// Window controls
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:set-always-on-top', (_, flag) => {
  isAlwaysOnTopState = flag;
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(flag, 'floating');
  }
  return isAlwaysOnTopState;
});

ipcMain.handle('window:is-always-on-top', () => {
  return isAlwaysOnTopState;
});

ipcMain.handle('window:set-compact-mode', (_, compact) => {
  isCompact = compact;
  if (!mainWindow) return isCompact;
  if (compact) {
    mainWindow.setSize(440, 680, true);
    mainWindow.setAlwaysOnTop(true, 'floating');
    isAlwaysOnTopState = true;
  } else {
    mainWindow.setSize(1080, 720, true);
  }
  return isCompact;
});

app.whenReady().then(() => {
  initLocalStorage();
  createWindow();

  // Register Global Shortcut (Ctrl+Shift+S / Cmd+Shift+S)
  try {
    globalShortcut.register('CommandOrControl+Shift+S', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('quick-search-trigger');
      }
    });
  } catch (e) {
    console.warn('Could not register global shortcut:', e);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

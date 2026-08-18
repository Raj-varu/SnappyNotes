const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const sampleSnippets = [
  {
    id: 'snip-1',
    title: 'Refund Approval & Transaction Receipt',
    command: '/refund',
    category: 'Billing',
    tags: ['refund', 'stripe', 'finance', 'payment'],
    html: '<p>Hi <strong>{{Customer Name}}</strong>,</p><p>We have processed your refund of <strong>{{Refund Amount}}</strong> for Ticket #<strong>{{Ticket ID}}</strong>.</p><ul><li><strong>Payment Method:</strong> Original Card</li><li><strong>Estimated Arrival:</strong> 3-5 business days</li></ul><p>Best regards,<br/><em>{{Agent Name}}</em></p>',
    text: 'Hi {{Customer Name}},\n\nWe have processed your refund of {{Refund Amount}} for Ticket #{{Ticket ID}}.\n\n• Payment Method: Original Card\n• Estimated Arrival: 3-5 business days\n\nBest regards,\n{{Agent Name}}',
    pinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'snip-2',
    title: 'Zendesk Ticket Escalation to Tier-2 Engineering',
    command: '/escalate',
    category: 'Technical',
    tags: ['tier2', 'engineering', 'bug', 'critical'],
    html: '<p>Hello <strong>{{Customer Name}}</strong>,</p><p>Thank you for your patience while we investigate your issue regarding <em>{{Issue Summary}}</em>.</p><p>I have escalated your case directly to our Tier-2 Engineering team (Ref: <code>#ENG-{{Ticket ID}}</code>). You will hear back from us within 4 hours.</p><p>Sincerely,<br/><strong>{{Agent Name}}</strong> | Senior Support</p>',
    text: 'Hello {{Customer Name}},\n\nThank you for your patience while we investigate your issue regarding {{Issue Summary}}.\n\nI have escalated your case directly to our Tier-2 Engineering team (Ref: #ENG-{{Ticket ID}}). You will hear back from us within 4 hours.\n\nSincerely,\n{{Agent Name}} | Senior Support',
    pinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'snip-3',
    title: 'Two-Factor Authentication (2FA) Reset Instructions',
    command: '/2fa-reset',
    category: 'Security',
    tags: ['2fa', 'security', 'auth', 'login'],
    html: '<p>Hello <strong>{{Customer Name}}</strong>,</p><p>To safely restore access to your account with email <code>{{Customer Email}}</code>, please follow these verification steps:</p><ol><li>Navigate to <strong>Account Settings &gt; Security</strong></li><li>Click <strong>Regenerate Backup Codes</strong></li><li>Verify with your one-time SMS verification code</li></ol><p>Let us know if you need further help!</p>',
    text: 'Hello {{Customer Name}},\n\nTo safely restore access to your account with email {{Customer Email}}, please follow these verification steps:\n1. Navigate to Account Settings > Security\n2. Click Regenerate Backup Codes\n3. Verify with your one-time SMS verification code\n\nLet us know if you need further help!',
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'snip-4',
    title: 'Welcome & Initial Case Acknowledgement',
    command: '/welcome',
    category: 'General',
    tags: ['greeting', 'support', 'welcome'],
    html: '<p>Hi <strong>{{Customer Name}}</strong>,</p><p>Thanks for reaching out to customer support! My name is <strong>{{Agent Name}}</strong> and I am happy to help you with Ticket #<strong>{{Ticket ID}}</strong>.</p><p>I am reviewing your inquiry right now and will get back to you shortly.</p>',
    text: 'Hi {{Customer Name}},\n\nThanks for reaching out to customer support! My name is {{Agent Name}} and I am happy to help you with Ticket #{{Ticket ID}}.\n\nI am reviewing your inquiry right now and will get back to you shortly.',
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let isAlwaysOnTopState = false;

// IPC handlers for screenshot rendering
ipcMain.handle('snippets:load', async () => sampleSnippets);
ipcMain.handle('snippets:save', async () => ({ success: true, count: sampleSnippets.length }));
ipcMain.handle('storage:get-info', async () => ({
  filePath: 'C:\\Users\\MockUser\\Documents\\SnappyNotes\\snippets.json',
  dirPath: 'C:\\Users\\MockUser\\Documents\\SnappyNotes',
  fileSize: 4096,
  snippetCount: sampleSnippets.length
}));
ipcMain.handle('storage:open-folder', async () => true);
ipcMain.handle('storage:export-backup', async () => ({ success: true }));
ipcMain.handle('storage:import-backup', async () => ({ success: true, snippets: sampleSnippets }));
ipcMain.handle('clipboard:copy-rich', async () => ({ success: true }));
ipcMain.handle('window:minimize', () => {});
ipcMain.handle('window:maximize', () => {});
ipcMain.handle('window:close', () => {});
ipcMain.handle('window:set-always-on-top', (_, flag) => {
  isAlwaysOnTopState = flag;
  return isAlwaysOnTopState;
});
ipcMain.handle('window:is-always-on-top', () => isAlwaysOnTopState);
ipcMain.handle('window:set-compact-mode', (_, compact) => compact);

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    show: false,
    frame: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, '../electron/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const distPath = path.join(__dirname, '../dist/index.html');
  await win.loadFile(distPath);

  // Setup mock local storage state
  await win.webContents.executeJavaScript(`
    localStorage.setItem('snappy_user_categories', JSON.stringify(['Billing', 'Technical', 'Security', 'General']));
    localStorage.setItem('snappy_default_agent_name', 'Raj Varu');
    localStorage.setItem('snappy_theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    window.location.reload();
  `);

  await new Promise(r => setTimeout(r, 1500));

  fs.mkdirSync(path.join(__dirname, '../docs/screenshots'), { recursive: true });

  // Capture Light Mode
  const lightImg = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../docs/screenshots/dashboard-light.png'), lightImg.toPNG());
  console.log('[Screenshots] Saved dashboard-light.png');

  // Capture Dark Mode
  await win.webContents.executeJavaScript(`
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('snappy_theme', 'dark');
  `);
  await new Promise(r => setTimeout(r, 800));
  const darkImg = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../docs/screenshots/dashboard-dark.png'), darkImg.toPNG());
  console.log('[Screenshots] Saved dashboard-dark.png');

  // Capture Compact Mode
  win.setSize(440, 680);
  await win.webContents.executeJavaScript(`
    document.documentElement.classList.add('dark');
  `);
  await new Promise(r => setTimeout(r, 800));
  const compactImg = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../docs/screenshots/compact-mode.png'), compactImg.toPNG());
  console.log('[Screenshots] Saved compact-mode.png');

  console.log('[Screenshots] All screenshots captured successfully!');
  app.quit();
});

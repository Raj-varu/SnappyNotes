const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distElectron = path.join(rootDir, 'dist-electron');
const releaseDir = path.join(rootDir, 'release');
const portableDir = path.join(releaseDir, 'Portable');
const setupDir = path.join(releaseDir, 'Setup');

fs.mkdirSync(portableDir, { recursive: true });
fs.mkdirSync(setupDir, { recursive: true });

if (fs.existsSync(distElectron)) {
  const files = fs.readdirSync(distElectron);
  for (const file of files) {
    const fullPath = path.join(distElectron, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) continue;

    if (file.toLowerCase().includes('portable') && file.endsWith('.exe')) {
      const dest = path.join(portableDir, file);
      fs.copyFileSync(fullPath, dest);
      console.log(`[Release] Copied Portable binary -> ${dest}`);
    } else if ((file.toLowerCase().includes('setup') || file.toLowerCase().includes('installer')) && file.endsWith('.exe')) {
      const dest = path.join(setupDir, file);
      fs.copyFileSync(fullPath, dest);
      console.log(`[Release] Copied Setup installer -> ${dest}`);
    }
  }
}

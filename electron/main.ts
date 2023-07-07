import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import 'dotenv/config';
import mongoose from 'mongoose';

const messages = {
  noMongodbURIFound: `
  لا يوجد رابط الاتصال في قاعدة البيانات
  No database connection string was found. Existing...
`,
};

// if (!process.env.MONOGDB_URI) {
//   alert(`  لا توجد قاعدة بيانات للأتصال
//             No database connection string was found. Existing...
//   `);
// }

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

const bootstrap = async () => {
  if (process.env.MONGODB_URI) {
    const mongodbConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(mongodbConnection);
  }

  process.env.DIST = path.join(__dirname, '../dist');
  process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public');

  let win: BrowserWindow | null;
  // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
  const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

  function createWindow() {
    win = new BrowserWindow({
      icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        // contextIsolation: true,
      },
    });

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
      win?.webContents.send(
        'main-process-message',
        new Date().toLocaleString()
      );
    });

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(process.env.DIST, 'index.html'));
    }
  }

  app.on('window-all-closed', () => {
    win = null;
  });

  app.whenReady().then(createWindow);

  ipcMain.on('ready', (event) => {
    if (!process.env.MONGODB_URI) {
      event.reply('alert_exit_error', messages.noMongodbURIFound);
    }

    // if (!process.env.MONGODB_URI) {
    //   event.reply('alert_exit_error', messages.noMongodbURIFound);
    // }
  });

  ipcMain.on('exit_error', () => {
    return process.exit(1);
  });
};

bootstrap();

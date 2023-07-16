import 'dotenv/config';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import mongoose from 'mongoose';
import InitalModel from './models/inital';
import { dirname } from 'path';

import activationReqest from './activation-request';
import activation from './activation';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const rootFs = dirname(__dirname);
console.log(rootFs);

const messages = {
  noMongodbURIFound: `
  لا يوجد رابط الاتصال في قاعدة البيانات
  No database connection string was found. Existing...
`,

  failedToConnectToDatabase: `
    فشل الاتصال في قاعدة البيانات
    Failed to connect to database. Existing...
  `,

  failedToActivate: `
    فشل تفعيل البرنامج
    Failed activation process.
  `,
};

const bootstrap = async () => {
  let failedToConnectToDB = false;
  let failedToActivate = false;

  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);

      try {
        const key = await InitalModel.findOne({ define: 'key' });

        // If key does not exist than send an activation request
        if (!key) {
          await activationReqest();
        }

        // Check activation status
        await activation();
      } catch (err) {
        failedToActivate = true;
      }
    } catch (err) {
      failedToConnectToDB = true;
    }
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

    if (failedToConnectToDB) {
      event.reply('alert_exit_error', messages.failedToConnectToDatabase);
    }

    if (failedToActivate) {
      event.reply('alert_exit_error', messages.failedToActivate);
    }
  });

  ipcMain.on('exit_error', () => {
    return process.exit(1);
  });
};

bootstrap();

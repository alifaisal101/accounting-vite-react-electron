import crypto from 'crypto';

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import 'dotenv/config';
import mongoose from 'mongoose';
import { machineIdSync } from 'node-machine-id';
import InitalModel from './models/inital';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

import activate from './activate.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const rootFs = dirname(__dirname);

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
  let failedToConnectToDB = false;
  let failedToActivate = false;

  if (process.env.MONGODB_URI) {
    try {
      const mongodbConnection = await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
      failedToConnectToDB = true;
    }

    // check if there is already a private key in the database, if not activate

    let isActivated = false;
    // const key = await InitalModel.findOne({ define: 'key' });
    // const secret = await InitalModel.findOne({ define: 'secret' });

    try {
      // Activation keys exist
      const key = readFileSync(join(rootFs, '.define.key'));
      const secret = readFileSync(join(rootFs, '.define.secret'));
      console.log('yeah they were found');
      console.log({
        //@ts-ignore
        key: key.toString(),
        oaepHash: process.env.OAEP_HASH,
        //@ts-ignore
        padding: crypto.constants[process.env.PADDING],
        passphrase: '',
      });

      console.log(
        activate(
          {
            //@ts-ignore
            key: key.toString(),
            oaepHash: process.env.OAEP_HASH,
            //@ts-ignore
            padding: crypto.constants[process.env.PADDING],
            passphrase: '',
          },
          secret
        )
      );
    } catch (err) {
      // Activation keys don't exist, so activate

      console.log(err);
      // @ts-ignore
      if (err.errno == -2) {
        console.log('they were not found, Activating...');
        try {
          if (!process.env.ACTIVATION_API) {
            throw new Error('No Activation API was found');
          }
          console.log(`${process.env.SERVER_URL}/activate`);
          const machineId = machineIdSync();
          const responce = await fetch(`${process.env.SERVER_URL}activate`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              machineId,
              apiKey: process.env.ACTIVATION_API,
            }),
          });

          const { secret, privateKey } = await responce.json();
          const secret_buffer = Buffer.from(secret.data);
          const privateKey_buffer = Buffer.from(privateKey.data);

          writeFileSync(join(rootFs, '.define.key'), privateKey_buffer);
          writeFileSync(join(rootFs, '.define.secret'), secret_buffer);
        } catch (err) {
          console.log(err);
          failedToActivate = true;
        }
      }
      // // if one is defined and the other is null
      // if ((key && !secret) || (secret && !key)) {
      //   throw new Error('Activation process failed.');
      // }

      // isActivated = key && secret ? true : false;

      // if (isActivated) {
      //   console.log(secret!.data!.buffer);
      //   const result = crypto.privateDecrypt(
      //     {
      //       //@ts-ignore
      //       key: key!.key,
      //       oaepHash: process.env.OAEP_HASH,
      //       //@ts-ignore
      //       padding: crypto.constants[process.env.PADDING],
      //       passphrase: '',
      //     },
      //     secret!.data!.buffer
      //   );

      //   console.log(result.toString());
      // } else {
      //   // Activatsion
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

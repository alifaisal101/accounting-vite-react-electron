import 'dotenv/config';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import mongoose from 'mongoose';
import InitalModel from './models/inital';
// import { dirname } from 'path';

import activationReqest from './activation-request';
import activation from './activation';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
} from './controllers/product.con';
import {
  getPrintSettings,
  savePrintSettings,
} from './controllers/printsettings.con';
import {
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
  fetchCustomersOnDate,
  getCustomersNames,
  saveCustomer,
} from './controllers/customer.con';
import { savePurchases } from './controllers/purchase.con';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// const rootFs = dirname(__dirname);

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
      width: 1366,
      height: 768,
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

  // Products Handling IPC
  ipcMain.on('add-product', async (event, product) => {
    try {
      const productResult = await createProduct(product);
      event.reply('add-product-result', productResult);
    } catch (err) {
      console.log(err);
      event.reply('failed-add-product');
    }
  });

  ipcMain.on('fetch-products', async (event) => {
    try {
      const products = await fetchProducts();
      event.reply('products-result', products);
    } catch (err) {
      event.reply('failed-fetch-products');
    }
  });

  ipcMain.on('delete-product', async (event, _id) => {
    try {
      const deleteResult = await deleteProduct(_id);
      event.reply('delete-product-result', deleteResult);
    } catch (err) {
      event.reply('failed-delete-product');
    }
  });

  // Print Handling
  ipcMain.on('get-printsettings', async (event) => {
    try {
      const printSettingsResult = await getPrintSettings();
      event.reply('get-printsettings-result', printSettingsResult);
    } catch (err) {
      event.reply('failed-get-printsettings');
    }
  });

  ipcMain.on('set-printsettings', async (event, printsettings) => {
    try {
      const setPrintSettingsResult = await savePrintSettings(printsettings);
      event.reply('set-printsettings-result', setPrintSettingsResult);
    } catch (err) {
      event.reply('failed-set-printsettings');
    }
  });

  // Customers Events handling
  ipcMain.on('get-customers-names', async (event) => {
    try {
      const result = await getCustomersNames();
      event.reply('get-customers-names-result', result);
    } catch (err) {
      console.log(err);
      event.reply('failed-get-customers-names');
    }
  });

  ipcMain.on('fetch-customer', async (event, full, _id) => {
    try {
      const result = await fetchCustomer(_id, full);
      event.reply('fetch-customer-result', result);
    } catch (err) {
      console.log(err);
      event.reply('failed-fetch-customer');
    }
  });

  ipcMain.on('fetch-customers', async (event) => {
    try {
      const result = await fetchCustomers();
      event.reply('fetch-customers-result', result);
    } catch (err) {
      event.reply('failed-fetch-customers');
    }
  });

  ipcMain.on('fetch-ondate', async (event, date) => {
    try {
      const result = await fetchCustomersOnDate(date);
      event.reply('fetch-ondate-result', result);
    } catch (err) {
      event.reply('failed-fetch-ondate');
    }
  });

  ipcMain.on('add-customer', async (event, customer) => {
    try {
      const result = await saveCustomer(customer);
      event.reply('add-customer-result', result);
    } catch (err) {
      console.log(err);
      event.reply('failed-add-customer');
    }
  });

  ipcMain.on('delete-customer', async (event, _id) => {
    try {
      const result = await deleteCustomer(_id);
      event.reply('delete-customer-result', result);
    } catch (err) {
      event.reply('failed-customer-delete');
    }
  });

  ipcMain.on('save-purchases', async (event, purchases) => {
    try {
      const result = await savePurchases(purchases);

      event.reply('save-purchases-result', result);
    } catch (err) {
      event.reply('failed-save-purchases');
    }
  });
};

bootstrap();

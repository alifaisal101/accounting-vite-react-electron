import { contextBridge, ipcRenderer } from 'electron';
import { InProduct } from './models/product';
import { arrayBufferToJson, jsonToBase64Url } from './utils/functions/data';
import { InPrintSettings } from './models/printsettings';
import { GridFilterModel, GridSortModel } from './grid-models';

function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive']
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
    informMain() {
      ipcRenderer.send('ready');
      ipcRenderer.on('alert_exit_error', (_event, message: string) => {
        alert(message);
        ipcRenderer.send('exit_error');
      });
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading, informMain } = useLoading();
domReady().then(appendLoading);
domReady().then(informMain);

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);

contextBridge.exposeInMainWorld('e_products', {
  addProduct: (product: InProduct, cb: Function) => {
    if (product.image) {
      // @ts-ignore
      product.image = arrayBufferToJson(product.image);
    }
    ipcRenderer.send('add-product', product);
    ipcRenderer.on('add-product-result', (_event, productResult) => {
      if (productResult.image) {
        productResult.imageUrl = jsonToBase64Url(productResult.image);
        delete productResult.image;
      }
      cb(null, productResult);
      ipcRenderer.removeAllListeners('add-product-result');
    });
    ipcRenderer.on('failed-add-product', () => {
      cb(new Error('failed to register'), null);
      ipcRenderer.removeAllListeners('failed-add-product');
    });
  },

  fetchProducts: (cb: Function) => {
    ipcRenderer.send('fetch-products');

    ipcRenderer.on('products-result', (_event, products) => {
      for (let i = 0; i < products.length; i++) {
        if (products[i].image) {
          products[i].imageUrl = jsonToBase64Url(products[i].image);
          delete products[i].image;
        }
      }
      cb(null, products);
      ipcRenderer.removeAllListeners('products-result');
    });

    ipcRenderer.on('failed-fetch-products', () => {
      cb(new Error('failed to fetch'), null);
      ipcRenderer.removeAllListeners('failed-fetch-products');
    });
  },

  deleteProduct: (_id: string, cb: Function) => {
    ipcRenderer.send('delete-product', _id);
    ipcRenderer.on('delete-product-result', (_event, deleteResult) => {
      cb(null, deleteResult);
      ipcRenderer.removeAllListeners('delete-product-result');
    });
    ipcRenderer.on('failed-delete-product', (_event) => {
      cb(new Error('Failed to delete product'), null);
      ipcRenderer.removeAllListeners('failed-delete-product');
    });
  },
});

contextBridge.exposeInMainWorld('e_customers', {
  getCustomersNames: (cb: Function) => {
    ipcRenderer.send('get-customers-names');
    ipcRenderer.on('get-customers-names-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('get-customers-names-result');
    });
    ipcRenderer.on('failed-get-customers-names', (_event) => {
      cb(new Error('Failed to fetch customers names'), null);
      ipcRenderer.removeAllListeners('failed-get-customers-names');
    });
  },

  fetchCustomer: (full: boolean, _id: string, cb: Function) => {
    ipcRenderer.send('fetch-customer', full, _id);
    ipcRenderer.on('fetch-customer-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('fetch-customer-result');
    });
    ipcRenderer.on('failed-fetch-customer', (_event) => {
      cb(new Error('failed to fetch customer'), null);
      ipcRenderer.removeAllListeners('failed-fetch-customer');
    });
  },

  fetchCustomers: (
    take: number,
    skip: number,
    filterModel: GridFilterModel,
    sortModel: GridSortModel,
    cb: Function
  ) => {
    ipcRenderer.send('fetch-customers', take, skip, filterModel, sortModel);
    ipcRenderer.on('fetch-customers-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('fetch-customers-result');
    });
    ipcRenderer.on('failed-fetch-customers', () => {
      cb(new Error('Failed to fetch customer'), null);
      ipcRenderer.removeAllListeners('failed-fetch-customers');
    });
  },

  addCustomer: (customer: any, cb: Function) => {
    ipcRenderer.send('add-customer', customer);
    ipcRenderer.on('add-customer-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('add-customer-result');
    });

    ipcRenderer.on('failed-add-customer', (_event) => {
      cb(new Error('failed to add customer'), null);
      ipcRenderer.removeAllListeners('failed-add-customer');
    });
  },

  fetchOnDates: (date: any, cb: Function) => {
    ipcRenderer.send('fetch-ondate', date);
    ipcRenderer.on('fetch-ondate-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('fetch-ondate-result');
    });
    ipcRenderer.on('failed-fetch-ondate', (_event) => {
      cb(new Error('failed to fetch on date'), null);
      ipcRenderer.removeAllListeners('failed-fetch-ondate');
    });
  },

  deleteCustomer: (_id: any, cb: Function) => {
    ipcRenderer.send('delete-customer', _id);
    ipcRenderer.on('delete-customer-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('delete-customer-result');
    });
    ipcRenderer.on('failed-customer-delete', (_event) => {
      cb(new Error('failed to delete customer'), null);
      ipcRenderer.removeAllListeners('failed-customer-delete');
    });
  },

  savePurchases: (purchases: any, cb: Function) => {
    ipcRenderer.send('save-purchases', purchases);
    ipcRenderer.on('save-purchases-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('save-purchases-result');
    });

    ipcRenderer.on('failed-save-purchases', (_event) => {
      cb(new Error('failed to save purchases'), null);
      ipcRenderer.removeAllListeners('save-purchases-result');
    });
  },
});

contextBridge.exposeInMainWorld('e_print', {
  getPrintSettings: (cb: Function) => {
    ipcRenderer.send('get-printsettings');
    ipcRenderer.on(
      'get-printsettings-result',
      (_event, printSettingsResult) => {
        if (printSettingsResult?.image) {
          printSettingsResult.imageUrl = jsonToBase64Url(
            printSettingsResult.image
          );
        }
        cb(null, printSettingsResult);
        ipcRenderer.removeAllListeners('get-printsettings-result');
      }
    );
    ipcRenderer.on('failed-get-printsettings', () => {
      cb(new Error('failed to register'), null);
      ipcRenderer.removeAllListeners('failed-get-printsettings');
    });
  },

  setPrintSettings: (printSettings: InPrintSettings, cb: Function) => {
    if (printSettings.image) {
      if (typeof printSettings?.image != 'string') {
        // @ts-ignore
        printSettings.image = arrayBufferToJson(printSettings.image);
      }
    }

    ipcRenderer.send('set-printsettings', printSettings);
    ipcRenderer.on('set-printsettings-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('set-printsettings-result');
    });
    ipcRenderer.on('failed-set-printsettings', () => {
      cb(new Error('Failed to save printsettings'), null);
      ipcRenderer.removeAllListeners('failed-set-printsettings');
    });
  },
});

contextBridge.exposeInMainWorld('e_util', {
  // Replacing the alert and confirm function with new ones, fixing the input focus issue

  alert: (msg?: string) => {
    const res = window.alert(msg);
    ipcRenderer.send('focus-fix');
    return res;
  },

  confirm: (msg?: string) => {
    const res = window.confirm(msg);
    ipcRenderer.send('focus-fix');
    return res;
  },

  genNewMongoIdStr: (cb: Function) => {
    ipcRenderer.send('gen-new-mongo-id-str');
    ipcRenderer.on('gen-new-mongo-id-str-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('gen-new-mongo-id-str-result');
    });

    ipcRenderer.on('gen-new-mongo-id-str-failed', () => {
      cb(new Error('Failed to gen ID'), null);
      ipcRenderer.removeAllListeners('gen-new-mongo-id-str-failed');
    });
  },

  getOsPlatform: (cb: Function) => {
    ipcRenderer.send('get-os');
    ipcRenderer.on('get-os-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('get-os-result');
    });
    ipcRenderer.on('failed-get-os', () => {
      cb(new Error('Failed to get OS'), null);
      ipcRenderer.removeAllListeners('failed-get-os');
    });
  },
});

contextBridge.exposeInMainWorld('e_backups', {
  fetchBackups: (cb: Function) => {
    ipcRenderer.send('fetch-backups');

    ipcRenderer.on('fetch-backups-result', (_event, backups) => {
      cb(null, backups);
      ipcRenderer.removeAllListeners('fetch-backups-result');
    });

    ipcRenderer.on('failed-fetch-backups', () => {
      cb(new Error('failed to fetch'), null);
      ipcRenderer.removeAllListeners('failed-fetch-backups');
    });
  },

  addBackup: (backup: object, cb: Function) => {
    ipcRenderer.send('add-backup', backup);

    ipcRenderer.on('add-backup-result', (_event, backup) => {
      cb(null, backup);
      ipcRenderer.removeAllListeners('add-backup-result');
    });

    ipcRenderer.on('failed-add-backup', () => {
      cb(new Error('failed to add'), null);
      ipcRenderer.removeAllListeners('failed-add-backup');
    });
  },

  updateBackup: (modifiedBackup: object, cb: Function) => {
    ipcRenderer.send('update-backup', modifiedBackup);

    ipcRenderer.on('update-backup-result', (_event, modifiedBackup) => {
      cb(null, modifiedBackup);
      ipcRenderer.removeAllListeners('update-backup-result');
    });

    ipcRenderer.on('failed-update-backup', () => {
      cb(new Error('failed to update'), null);
      ipcRenderer.removeAllListeners('failed-update-backup');
    });
  },

  deleteBackup: (_id: string, cb: Function) => {
    ipcRenderer.send('delete-backup', _id);
    ipcRenderer.on('delete-backup-result', (_event, deleteResult) => {
      cb(null, deleteResult);
      ipcRenderer.removeAllListeners('delete-backup-result');
    });
    ipcRenderer.on('failed-delete-backup', (_event) => {
      cb(new Error('Failed to delete backup'), null);
      ipcRenderer.removeAllListeners('failed-delete-backup');
    });
  },

  openDirectory: (cb: Function) => {
    ipcRenderer.send('open-directory');
    ipcRenderer.on('open-directory-result', (_event, path) => {
      cb(null, path);
      ipcRenderer.removeAllListeners('open-directory-result');
    });
    ipcRenderer.on('open-directory-failed', (_event) => {
      cb(new Error('Failed to select folder.'), null);
      ipcRenderer.removeAllListeners('open-directory-failed');
    });
  },
});
contextBridge.exposeInMainWorld('e_financesSummary', {
  getFinancesSummary: (cb: Function) => {
    ipcRenderer.send('get-finances-summary');
    ipcRenderer.on('get-finances-summary-result', (_event, result) => {
      cb(null, result);
      ipcRenderer.removeAllListeners('get-finances-summary-result');
    });
    ipcRenderer.on('get-finances-summary-failed', (_event) => {
      cb(new Error('Failed to get finances summary.'), null);
      ipcRenderer.removeAllListeners('get-finances-summary-failed');
    });
  },
});

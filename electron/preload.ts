import { contextBridge, ipcRenderer } from 'electron';
import { InProduct } from './models/product';
import { arrayBufferToJson, jsonToBase64Url } from './utils/data';

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

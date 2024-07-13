import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RecoilRoot } from 'recoil';

// Replacing the alert and confirm function with new ones, fixing the input focus issue

alert = e_util.alert;
confirm = e_util.confirm;

ReactDOM.createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

postMessage({ payload: 'removeLoading' }, '*');

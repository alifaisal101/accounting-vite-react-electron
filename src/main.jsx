import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Replacing the alert and confirm function with new ones, fixing the input focus issue

alert = e_util.alert;
confirm = e_util.confirm;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

postMessage({ payload: 'removeLoading' }, '*');

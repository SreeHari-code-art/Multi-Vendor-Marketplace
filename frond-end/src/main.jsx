import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './app/store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Apply initial theme from localStorage or system preference before rendering
const savedTheme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-bs-theme', savedTheme);

/**
 * Montaje principal de la aplicación React con el Provider de Redux 
 * y el soporte estricto para modo de desarrollo (StrictMode).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
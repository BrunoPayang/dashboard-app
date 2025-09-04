import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { store } from './features/store';
import { DynamicThemeProvider } from './components/theme/DynamicThemeProvider';
import './utils/clearInvalidData'; // Clear any invalid school data on startup

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <DynamicThemeProvider>
          <CssBaseline />
          <App />
        </DynamicThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

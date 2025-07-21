import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import "./globals.css";

import { Provider } from 'react-redux';
import { store } from './redux/store';

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components
import EntryPage from './pages/EntryPage';
import Sidebar from './components/sidebar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div className='flex'>
        <Sidebar></Sidebar>
        <div className='w-full'>
          <Routes>
            
            <Route path="/" element={<App />} />
            <Route path="/entry/:id" element={<EntryPage />} />
          </Routes>
        </div>
        </div>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();

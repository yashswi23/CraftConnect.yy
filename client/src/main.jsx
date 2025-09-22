// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import zaroori hai
import App from './App.jsx';
import './index.css';
import { UserProvider } from './contexts/UserContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Poori App ko BrowserRouter ke andar rakhein */}
    <BrowserRouter> 
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
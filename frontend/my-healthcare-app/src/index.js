import React from 'react';
import ReactDOM from 'react-dom/client';  // ✅ Use createRoot instead of render
import App from './App';
import { AuthProvider } from './context/AuthContext';  // ✅ Import Auth Context

const root = ReactDOM.createRoot(document.getElementById('root')); // ✅ Create root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

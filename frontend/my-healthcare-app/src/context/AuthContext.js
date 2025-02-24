import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user data
  const [token, setToken] = useState(null); // Store token

  // ✅ Fetch user profile when token is available
  useEffect(() => {
    if (token) {
      axios.get('https://healthcare-backend-a66n.onrender.com/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUser(response.data))  // ✅ Set user data
      .catch(error => console.error('Error fetching user:', error));
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

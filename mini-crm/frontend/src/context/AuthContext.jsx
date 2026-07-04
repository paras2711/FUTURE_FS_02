import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('crm_token') || null);
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Dynamically configure Axios default auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  // Handle successful login
  const login = (jwtToken, adminData) => {
    localStorage.setItem('crm_token', jwtToken);
    localStorage.setItem('crm_admin', JSON.stringify(adminData));
    setToken(jwtToken);
    setAdmin(adminData);
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_admin');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;

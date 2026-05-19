import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem('hp_token');
    const storedUser = localStorage.getItem('hp_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData) => {
    localStorage.setItem('hp_token', tokenVal);
    localStorage.setItem('hp_user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hp_token');
    localStorage.removeItem('hp_user');
    setToken(null);
    setUser(null);
  };

  // Helper to make authenticated API calls
  const authFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authFetch, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

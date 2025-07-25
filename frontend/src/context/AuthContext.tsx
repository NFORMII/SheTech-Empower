import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../api/axios';

interface AuthContextProps {
  user: any;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('token');
    if (saved) setAuthToken(saved); // 👈 immediately apply token
    return saved;
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (token) {
      api.get('accounts/me/')
        .then(res => setUser(res.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = (newToken: string, userData: any) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setAuthToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

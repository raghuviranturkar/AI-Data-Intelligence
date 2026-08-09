import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedAccess = localStorage.getItem('accessToken');
      const storedRefresh = localStorage.getItem('refreshToken');
      if (storedAccess && storedRefresh) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        const ok = await fetchUser(storedAccess);
        if (!ok) {
          try {
            const refreshResp = await api.post('/auth/refresh', null, {
              params: { refresh_token: storedRefresh }
            });
            const newAccess = refreshResp.data.access_token;
            const newRefresh = refreshResp.data.refresh_token;
            setTokens(newAccess, newRefresh);
            await fetchUser(newAccess);
          } catch {
            clearTokens();
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    await fetchUser(access_token);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password });
  };

  const logout = () => {
    clearTokens();
  };

  const refreshSession = async () => {
    if (!refreshToken) throw new Error('No refresh token');
    const response = await api.post('/auth/refresh', null, {
      params: { refresh_token: refreshToken }
    });
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    await fetchUser(access_token);
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  username: string;
  role: 'admin' | 'editor';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const DEFAULT_USERNAME = 'admin.shabab';
const DEFAULT_PASSWORD = 'Shabab@20262027';
const AUTH_KEY = 'admin_auth';
const CREDENTIALS_KEY = 'admin_credentials';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const getCredentials = () => {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
      }
    }
    return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
  };

  const login = (username: string, password: string): boolean => {
    const creds = getCredentials();
    if (username === creds.username && password === creds.password) {
      const adminUser: AdminUser = { username, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    const creds = getCredentials();
    if (oldPassword === creds.password) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ ...creds, password: newPassword }));
      return true;
    }
    return false;
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, changePassword, isAuthenticated: !!user }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

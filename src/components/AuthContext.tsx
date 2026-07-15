'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  name: string;
  phone: string;
  ward: string;
  houseNo: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'wardconnect-user-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const stored = localStorage.getItem(USER_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse user session', e);
        localStorage.removeItem(USER_SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (phone: string) => {
    // Initialize default profile on login
    const defaultProfile: UserProfile = {
      name: 'John Doe',
      phone: phone,
      ward: 'Greenfield Ward 12',
      houseNo: 'GH-42'
    };
    setUser(defaultProfile);
    setIsLoggedIn(true);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(defaultProfile));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(USER_SESSION_KEY);
  };

  const updateProfile = (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profileUpdates };
    setUser(updated);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige text-dark-teal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-dark-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-bold font-sans">Loading WardConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

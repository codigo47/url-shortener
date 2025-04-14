'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedEmail = localStorage.getItem('userEmail');
      if (token && storedEmail) {
        setIsAuthenticated(true);
        setUserEmail(storedEmail);
      }
    }
  }, []);

  const login = (token: string, email: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
    }
    setIsAuthenticated(true);
    setUserEmail(email);
    router.push('/dashboard');
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
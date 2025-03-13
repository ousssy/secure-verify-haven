
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, signOut } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage (in a real app, this would validate a token)
    const savedUser = localStorage.getItem('auth-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save user to localStorage when it changes
    if (user) {
      localStorage.setItem('auth-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth-user');
    }
  }, [user]);

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

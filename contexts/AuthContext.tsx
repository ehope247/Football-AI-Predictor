import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  incrementMessages: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);
  
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const incrementMessages = async () => {
      if(currentUser) {
          const updatedUser = await authService.incrementMessageCount(currentUser.username);
          setCurrentUser(updatedUser);
      }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isLoading, logout, incrementMessages }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

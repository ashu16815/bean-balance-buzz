
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Types
type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'customer' | 'barista' | 'admin';
};

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserCredits: (newCredits: number) => void;
};

// Sample users for demo
const SAMPLE_USERS = [
  {
    id: '1',
    name: 'Customer User',
    email: 'customer@example.com',
    password: 'password',
    credits: 10,
    role: 'customer' as const
  },
  {
    id: '2',
    name: 'Barista User',
    email: 'barista@example.com',
    password: 'password',
    credits: 20,
    role: 'barista' as const
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    credits: 100,
    role: 'admin' as const
  }
];

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for logged-in user on mount
    const savedUser = localStorage.getItem('cafeUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email and verify password
      const user = SAMPLE_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      
      // Save to local storage
      localStorage.setItem('cafeUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (SAMPLE_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be a database call)
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        credits: 5, // Starting credits
        role: 'customer' as const
      };
      
      // Add to "database" (would be persisted in a real app)
      SAMPLE_USERS.push({ ...newUser, password });
      
      setCurrentUser(newUser);
      localStorage.setItem('cafeUser', JSON.stringify(newUser));
      toast.success('Account created successfully! 5 credits added to your account.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cafeUser');
    toast.info('You have been logged out');
  };

  const updateUserCredits = (newCredits: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: newCredits };
      setCurrentUser(updatedUser);
      localStorage.setItem('cafeUser', JSON.stringify(updatedUser));
      
      // Also update in our "database"
      const userIndex = SAMPLE_USERS.findIndex(u => u.id === currentUser.id);
      if (userIndex >= 0) {
        SAMPLE_USERS[userIndex] = { ...SAMPLE_USERS[userIndex], credits: newCredits };
      }
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUserCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

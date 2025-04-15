import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// User roles for the system
export type UserRole = 'student' | 'teacher' | 'admin';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'student' as UserRole,
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    email: 'teacher@example.com',
    password: 'password123',
    name: 'Jane Smith',
    role: 'teacher' as UserRole,
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Jane'
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'password123',
    name: 'Alex Johnson',
    role: 'admin' as UserRole,
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alex'
  }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved user in local storage on initial load
    const savedUser = localStorage.getItem('scms_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('scms_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('scms_user', JSON.stringify(userWithoutPassword));
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('scms_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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

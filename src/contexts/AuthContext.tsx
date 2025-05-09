
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'admin' | 'labTechnician' | 'receptionist' | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@labsystem.com',
    password: 'admin123',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Lab Technician',
    email: 'tech@labsystem.com',
    password: 'tech123',
    role: 'labTechnician' as UserRole
  },
  {
    id: '3',
    name: 'Receptionist',
    email: 'reception@labsystem.com',
    password: 'reception123',
    role: 'receptionist' as UserRole
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from local storage
    const storedUser = localStorage.getItem('labUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('labUser', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${userWithoutPassword.name}!`,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('labUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const checkPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading,
      checkPermission
    }}>
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

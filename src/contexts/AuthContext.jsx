
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Sample user data (in a real app, you'd fetch this from an API)
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@labsystem.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Lab Technician', email: 'tech@labsystem.com', password: 'tech123', role: 'labTechnician' },
  { id: '3', name: 'Receptionist', email: 'reception@labsystem.com', password: 'reception123', role: 'receptionist' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('labUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // Remove password for security
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Save user to state and localStorage
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('labUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('labUser');
  };

  // Check user permissions
  const checkPermission = (allowedRoles = ['admin', 'labTechnician', 'receptionist']) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  // Provide the context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export role types for documentation purposes
export const UserRoles = {
  ADMIN: 'admin',
  LAB_TECHNICIAN: 'labTechnician',
  RECEPTIONIST: 'receptionist'
};

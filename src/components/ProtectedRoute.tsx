
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'labTechnician', 'receptionist']
}) => {
  const { isAuthenticated, checkPermission, isLoading } = useAuth();
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Handle both navigation systems
    if (navigation && navigation.navigate) {
      navigation.navigate('login');
      return null;
    }
    return <Navigate to="/login" replace />;
  }

  if (!checkPermission(allowedRoles)) {
    // Handle both navigation systems
    if (navigation && navigation.navigate) {
      navigation.navigate('unauthorized');
      return null;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

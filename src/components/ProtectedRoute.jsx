
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'labTechnician', 'receptionist']
}) => {
  const { isAuthenticated, checkPermission, isLoading } = useAuth();
  const { navigate } = useNavigation();

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
    navigate('login');
    return null;
  }

  if (!checkPermission(allowedRoles)) {
    navigate('unauthorized');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

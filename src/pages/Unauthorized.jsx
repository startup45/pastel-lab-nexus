
import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';

const Unauthorized = () => {
  const { navigate } = useNavigation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => navigate('dashboard')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('login')}
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

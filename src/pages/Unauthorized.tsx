
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShieldOff } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-lab-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <ShieldOff className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

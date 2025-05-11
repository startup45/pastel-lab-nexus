
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { TestTube, UserIcon, LockIcon } from 'lucide-react';
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast.success("Login successful! Redirecting to dashboard...");
      navigate('dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md shadow-lg animate-fade-in border-t-4 border-primary">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-md">
            <TestTube className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-center">Lab Management System</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-background border shadow-sm"
                />
              </div>
              <div className="text-xs text-muted-foreground ml-1">
                Demo logins: admin@labsystem.com, tech@labsystem.com, reception@labsystem.com
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-background border shadow-sm"
                />
              </div>
              <div className="text-xs text-muted-foreground ml-1">
                Demo passwords: admin123, tech123, reception123
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full"
              variant="lab"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground mt-2">
              Secure login with role-based access control
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

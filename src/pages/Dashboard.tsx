
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Shield, Mail, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Logo from '@/components/common/Logo';

const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse bg-primary/20 w-8 h-8 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium mb-8">Welcome, {user.name || user.email}</h1>
          
          <div className="auth-card">
            <h2 className="text-xl font-medium mb-6">Your account</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Email address</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Two-factor authentication</h3>
                  {user.hasTOTP ? (
                    <>
                      <p className="text-muted-foreground">
                        Your account is protected with an authenticator app
                      </p>
                      <div className="flex items-center mt-1 text-xs text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Enabled
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                      <button className="text-primary text-sm hover:underline mt-1">
                        Enable
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

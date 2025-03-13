
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="auth-button auth-button-primary"
            >
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/sign-in')}
                className="auth-button auth-button-outline"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/sign-up')}
                className="auth-button auth-button-primary"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-medium tracking-tight">
            Secure Multi-Factor Authentication
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Protect your account with email, Google, and authenticator app verification
          </p>
          
          <div className="flex justify-center gap-4 pt-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="auth-button auth-button-primary"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/sign-up')}
                className="auth-button auth-button-primary"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="pt-12 grid md:grid-cols-3 gap-8">
            <div className="auth-card">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Email Authentication</h3>
              <p className="text-muted-foreground">
                Secure your account with email verification codes
              </p>
            </div>
            
            <div className="auth-card">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Google Sign-In</h3>
              <p className="text-muted-foreground">
                Quick and secure access with your Google account
              </p>
            </div>
            
            <div className="auth-card">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Authenticator App</h3>
              <p className="text-muted-foreground">
                Add an extra layer of security with TOTP verification
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Import the QrCode icon to use in the component
import { Mail, QrCode } from 'lucide-react';

export default Index;

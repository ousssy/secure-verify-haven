
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import EmailAuth from '@/components/auth/EmailAuth';
import GoogleAuth from '@/components/auth/GoogleAuth';
import VerifyEmail from '@/components/auth/VerifyEmail';
import TOTPSetup from '@/components/auth/TOTPSetup';
import { useAuth } from '@/context/AuthContext';

const SignUp: React.FC = () => {
  const [authState, setAuthState] = useState<'email' | 'verify-email' | 'setup-totp'>('email');
  const [email, setEmail] = useState('');
  const { user, setUser, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse bg-primary/20 w-8 h-8 rounded-full"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setAuthState('verify-email');
  };

  const handleEmailVerifySuccess = () => {
    setAuthState('setup-totp');
  };

  const handleTOTPComplete = () => {
    // In a real app, this would come from the backend
    const user = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      avatar: null,
      hasTOTP: true
    };
    
    setUser(user);
    navigate('/dashboard');
  };

  const handleTOTPSkip = () => {
    // In a real app, this would come from the backend
    const user = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      avatar: null,
      hasTOTP: false
    };
    
    setUser(user);
    navigate('/dashboard');
  };

  const handleGoogleSuccess = () => {
    // In a real app, this would come from the backend
    const user = {
      id: '2',
      email: 'google-user@example.com',
      name: 'Google User',
      avatar: null,
      hasTOTP: false
    };
    
    setUser(user);
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title={
        authState === 'email' 
          ? 'Create an account' 
          : authState === 'verify-email'
          ? 'Check your email'
          : 'Setup authentication'
      }
      subtitle={
        authState === 'email' 
          ? 'Sign up to get started' 
          : undefined
      }
    >
      {authState === 'email' && (
        <>
          <EmailAuth isSignIn={false} onSuccess={handleEmailSuccess} />
          <GoogleAuth onSuccess={handleGoogleSuccess} />
        </>
      )}
      
      {authState === 'verify-email' && (
        <VerifyEmail 
          email={email}
          onVerify={handleEmailVerifySuccess}
          onBack={() => setAuthState('email')}
        />
      )}
      
      {authState === 'setup-totp' && (
        <TOTPSetup onComplete={handleTOTPComplete} onSkip={handleTOTPSkip} />
      )}
    </AuthLayout>
  );
};

export default SignUp;

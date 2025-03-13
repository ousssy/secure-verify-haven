
import React, { useState } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import { verifyTOTP } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import FadeTransition from '../common/FadeTransition';

interface AuthenticatorVerifyProps {
  onVerify: () => void;
}

const AuthenticatorVerify: React.FC<AuthenticatorVerifyProps> = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid 6-digit code",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyTOTP(code);
      
      if (success) {
        toast({
          title: "Verification successful",
          description: "Your identity has been verified",
        });
        onVerify();
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "The code you entered is invalid. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeTransition show={true}>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
      </div>

      <h2 className="text-xl font-medium text-center mb-2">Two-Factor Authentication</h2>
      <p className="text-center text-muted-foreground mb-8">
        Enter the verification code from your authenticator app
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="authenticator-code" className="auth-label">
            Authentication code
          </label>
          <input
            id="authenticator-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
            className="auth-input text-center text-lg font-mono"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="auth-button auth-button-primary w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Verify
        </button>
      </form>
    </FadeTransition>
  );
};

export default AuthenticatorVerify;

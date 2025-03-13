
import React, { useState } from 'react';
import { Loader2, QrCode, ClipboardCopy, Check } from 'lucide-react';
import { setupTOTP, verifyTOTP, AuthUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import FadeTransition from '../common/FadeTransition';

interface TOTPSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOTPSetup: React.FC<TOTPSetupProps> = ({ onComplete, onSkip }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [setupState, setSetupState] = useState<'initial' | 'setup' | 'verify'>('initial');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user, setUser } = useAuth();

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const result = await setupTOTP();
      
      if (result.success && result.secret && result.qrCode) {
        setSecret(result.secret);
        setQrCode(result.qrCode);
        setSetupState('setup');
      } else {
        toast({
          variant: "destructive",
          title: "Setup error",
          description: "Failed to setup authenticator",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Setup error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast({
      title: "Secret copied",
      description: "The secret key has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
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
          description: "Two-factor authentication has been enabled",
        });
        
        // Update user object with 2FA enabled
        if (user) {
          const updatedUser: AuthUser = {
            ...user,
            hasTOTP: true
          };
          setUser(updatedUser);
        }
        
        onComplete();
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

  if (setupState === 'initial') {
    return (
      <FadeTransition show={true}>
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="text-xl font-medium text-center mb-2">Two-Factor Authentication</h2>
        <p className="text-center text-muted-foreground mb-8">
          Protect your account with an authenticator app for additional security
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="auth-button auth-button-primary"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Set up authenticator
          </button>
          
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="auth-button auth-button-outline"
          >
            Skip for now
          </button>
        </div>
      </FadeTransition>
    );
  }

  if (setupState === 'setup') {
    return (
      <FadeTransition show={true}>
        <h2 className="text-xl font-medium text-center mb-6">Scan this QR code</h2>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-lg">
            <img 
              src={qrCode} 
              alt="QR Code for authenticator app" 
              className="w-48 h-48"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Or enter this setup key manually:
          </p>
          <div className="flex items-center">
            <code className="bg-muted p-2 rounded text-sm flex-1 font-mono">
              {secret}
            </code>
            <button
              onClick={handleCopySecret}
              className="ml-2 p-2 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardCopy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setSetupState('verify')}
          className="auth-button auth-button-primary w-full"
        >
          Continue
        </button>
      </FadeTransition>
    );
  }

  return (
    <FadeTransition show={true}>
      <h2 className="text-xl font-medium text-center mb-6">Verify setup</h2>
      
      <p className="text-center text-muted-foreground mb-6">
        Enter the 6-digit code from your authenticator app to verify setup
      </p>
      
      <div className="mb-6">
        <label htmlFor="totp-code" className="auth-label">
          Authentication code
        </label>
        <input
          id="totp-code"
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
        onClick={handleVerify}
        disabled={isLoading || code.length !== 6}
        className="auth-button auth-button-primary w-full"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Verify
      </button>
    </FadeTransition>
  );
};

export default TOTPSetup;

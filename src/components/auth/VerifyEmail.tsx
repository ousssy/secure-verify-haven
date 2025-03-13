
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Mail, ArrowLeft, Info } from 'lucide-react';
import { verifyEmail } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import FadeTransition from '../common/FadeTransition';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VerifyEmailProps {
  email: string;
  onVerify: () => void;
  onBack: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onVerify, onBack }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  // Pre-populate refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(0, 1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newCode.every(c => c !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 6).split('');
    const newCode = [...code];
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    
    setCode(newCode);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(c => !c);
    if (nextEmptyIndex >= 0) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      // Auto-submit when all fields are filled by paste
      handleVerify(newCode.join(''));
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsLoading(true);
    try {
      const success = await verifyEmail(email, verificationCode);
      
      if (success) {
        toast({
          title: "Email vérifié",
          description: "Votre email a été vérifié avec succès.",
        });
        onVerify();
      } else {
        toast({
          variant: "destructive",
          title: "Échec de vérification",
          description: "Le code que vous avez entré est invalide. Veuillez réessayer.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de vérification",
        description: "Une erreur inattendue s'est produite.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = () => {
    toast({
      title: "Code renvoyé",
      description: `Un nouveau code de vérification a été envoyé à ${email}`,
    });
  };

  return (
    <FadeTransition show={true}>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <p className="text-center text-muted-foreground mb-4">
        Nous avons envoyé un code de vérification à <span className="font-medium text-foreground">{email}</span>
      </p>
      
      <Alert className="mb-6 bg-muted/50 text-muted-foreground border-muted">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription>
          <span className="text-sm">Pour cette démo, vous pouvez utiliser n'importe quel code à 6 chiffres (ex: 123456)</span>
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center gap-2 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isLoading}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="auth-input w-12 h-14 text-center text-lg font-medium"
          />
        ))}
      </div>

      <button
        onClick={() => handleVerify(code.join(''))}
        disabled={isLoading || code.some(c => !c)}
        className="auth-button auth-button-primary w-full mb-4"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Vérifier
      </button>

      <div className="flex flex-col gap-3 text-center">
        <button 
          type="button" 
          onClick={resendCode}
          disabled={isLoading}
          className="text-sm text-primary hover:underline"
        >
          Vous n'avez pas reçu de code? Renvoyer
        </button>
        
        <button 
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Retour à la connexion
        </button>
      </div>
    </FadeTransition>
  );
};

export default VerifyEmail;


import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Mail, ArrowLeft, Info, ShieldCheck } from 'lucide-react';
import { verifyEmail } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import FadeTransition from '../common/FadeTransition';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const inputVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: i => ({
      scale: 1,
      opacity: 1,
      transition: { 
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <FadeTransition show={true}>
      <motion.div
        className="flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center justify-center mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40"
            animate={pulseAnimation}
          >
            <motion.div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" 
              style={{ animationDuration: '3s' }}
            />
            <Mail className="h-10 w-10 text-primary" />
          </motion.div>
        </motion.div>

        <motion.h2 
          className="text-2xl font-semibold mb-2 text-center"
          variants={itemVariants}
        >
          Vérification par code
        </motion.h2>

        <motion.p 
          className="text-center text-muted-foreground mb-4"
          variants={itemVariants}
        >
          Nous avons envoyé un code de vérification à <span className="font-medium text-foreground">{email}</span>
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="w-full"
        >
          <Alert className="mb-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 text-muted-foreground">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              <span className="text-sm">Pour cette démo, vous pouvez utiliser n'importe quel code à 6 chiffres (ex: 123456)</span>
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <motion.div 
          className="flex justify-center gap-2 mb-8"
          variants={itemVariants}
        >
          {code.map((digit, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-lg font-medium bg-white dark:bg-gray-800 border-2 border-muted rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          onClick={() => handleVerify(code.join(''))}
          disabled={isLoading || code.some(c => !c)}
          className="w-full py-3.5 px-6 mb-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-5 w-5" />
          )}
          Vérifier
        </motion.button>

        <motion.div 
          className="flex flex-col gap-3 text-center"
          variants={itemVariants}
        >
          <motion.button 
            type="button" 
            onClick={resendCode}
            disabled={isLoading}
            className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Vous n'avez pas reçu de code? Renvoyer
          </motion.button>
          
          <motion.button 
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Retour à la connexion
          </motion.button>
        </motion.div>
      </motion.div>
    </FadeTransition>
  );
};

export default VerifyEmail;

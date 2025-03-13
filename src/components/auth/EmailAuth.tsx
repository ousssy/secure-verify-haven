
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import FadeTransition from '../common/FadeTransition';

interface EmailAuthProps {
  isSignIn: boolean;
  onSuccess: (email: string) => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { 
    message: 'Password must be at least 6 characters long' 
  }),
});

type FormData = z.infer<typeof formSchema>;

const EmailAuth: React.FC<EmailAuthProps> = ({ isSignIn, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = isSignIn 
        ? await signInWithEmail(data.email, data.password)
        : await signUpWithEmail(data.email, data.password);
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: result.message || "An error occurred",
        });
        return;
      }
      
      onSuccess(data.email);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeTransition show={true} className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="auth-label">Email address</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              disabled={isLoading}
              placeholder="name@example.com"
              className="auth-input pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="auth-label">Password</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              disabled={isLoading}
              placeholder="••••••••"
              className="auth-input pl-10"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        
        {isSignIn && (
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="auth-button auth-button-primary w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSignIn ? "Sign in" : "Create account"}
        </button>
        
        <div className="text-center text-sm">
          {isSignIn ? (
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </form>
    </FadeTransition>
  );
};

export default EmailAuth;

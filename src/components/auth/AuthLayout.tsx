
import React from 'react';
import Logo from '../common/Logo';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  className
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-background">
      <div className={cn("w-full max-w-md", className)}>
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="auth-card animate-slide-up">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-medium mb-1">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

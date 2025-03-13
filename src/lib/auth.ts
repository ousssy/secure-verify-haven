
import { toast } from '@/hooks/use-toast';

export type AuthMethod = 'email' | 'google' | 'totp';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  hasTOTP: boolean;
}

// In a real app, these would connect to a backend
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  if (!email.includes('@') || password.length < 6) {
    return { 
      success: false, 
      message: 'Invalid email or password' 
    };
  }
  
  // Mock user
  return { 
    success: true,
    user: {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: null,
      hasTOTP: true
    }
  };
};

export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  if (!email.includes('@') || password.length < 6) {
    return { 
      success: false, 
      message: 'Invalid email or password' 
    };
  }
  
  // Mock user
  return { 
    success: true,
    user: {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: null,
      hasTOTP: false
    }
  };
};

export const verifyEmail = async (
  email: string,
  code: string
): Promise<boolean> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple mock - accept any 6-digit code
  return code.length === 6 && /^\d+$/.test(code);
};

export const signInWithGoogle = async (): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
  toast({
    title: "Google authentication",
    description: "This would connect to Google OAuth in a real app",
  });
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock user
  return { 
    success: true,
    user: {
      id: '2',
      email: 'google-user@example.com',
      name: 'Google User',
      avatar: null,
      hasTOTP: false
    }
  };
};

export const setupTOTP = async (): Promise<{ success: boolean; secret?: string; qrCode?: string }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock TOTP setup - in a real app, this would be generated on the server
  const mockSecret = 'JBSWY3DPEHPK3PXP';
  const mockQrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SecureAuth:user@example.com?secret=${mockSecret}&issuer=SecureAuth`;
  
  return {
    success: true,
    secret: mockSecret,
    qrCode: mockQrCodeURL
  };
};

export const verifyTOTP = async (code: string): Promise<boolean> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple mock - accept any 6-digit code
  return code.length === 6 && /^\d+$/.test(code);
};

export const signOut = async (): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would make a call to your backend
};


import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative w-10 h-10"
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-500 rounded-xl"
          animate={{ 
            boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0.3)", "0px 0px 15px rgba(59, 130, 246, 0.6)", "0px 0px 0px rgba(59, 130, 246, 0.3)"] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" strokeWidth={2.5} />
        </div>
      </motion.div>
      <div className="flex flex-col items-start">
        <motion.span 
          className="font-bold text-xl tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-primary">info</span>
          <span className="text-foreground">3</span>
          <span className="text-primary">secure</span>
        </motion.span>
        <motion.span 
          className="text-xs text-muted-foreground tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          PROTECTION AVANCÉE
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Logo;

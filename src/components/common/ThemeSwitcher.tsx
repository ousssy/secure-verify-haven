
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ThemeSwitcher: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme on mount
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center w-12 h-6 rounded-full p-1 transition-colors duration-300",
        isDarkMode ? "bg-slate-700" : "bg-blue-100"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className={cn(
          "absolute flex items-center justify-center w-5 h-5 rounded-full shadow-md",
          isDarkMode ? "bg-slate-800" : "bg-blue-50"
        )}
        initial={{ x: isDarkMode ? "100%" : "0%" }}
        animate={{ x: isDarkMode ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDarkMode ? (
          <Moon className="w-3 h-3 text-blue-300" />
        ) : (
          <Sun className="w-3 h-3 text-amber-400" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher;

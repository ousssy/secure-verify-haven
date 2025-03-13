
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-primary rounded-xl animate-pulse opacity-50"></div>
        <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-md"></div>
        </div>
      </div>
      <span className="font-semibold text-xl">SecureAuth</span>
    </div>
  );
};

export default Logo;

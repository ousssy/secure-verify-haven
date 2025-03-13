
import React from 'react';
import { cn } from '@/lib/utils';

interface FadeTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({
  show,
  children,
  className,
}) => {
  const [render, setRender] = React.useState(show);

  React.useEffect(() => {
    if (show) setRender(true);
    const timer = setTimeout(() => {
      if (!show) setRender(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [show]);

  if (!render) return null;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        show ? "opacity-100 animate-scale-in" : "opacity-0 animate-scale-out",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FadeTransition;

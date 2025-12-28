import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]': 
            variant === 'default',
          'bg-dark-card text-gray-300 hover:bg-dark-hover border border-dark-border': 
            variant === 'outline',
          'h-11 px-8': size === 'default',
          'h-9 px-4 text-sm': size === 'sm',
          'h-14 px-10 text-lg': size === 'lg',
        },
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

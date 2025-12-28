import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-dark-border bg-dark-card px-4 py-3 text-base",
        "text-gray-100 placeholder:text-gray-500",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        "hover:border-indigo-500/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

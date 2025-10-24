import React, { HTMLAttributes, forwardRef } from 'react';
// RUTA CORREGIDA: Desde 'src/components/ui/' hasta 'src/lib/utils'
import { cn } from '../../lib/utils'; 

// ------------------------------------
// Base Card Component
// ------------------------------------
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// ------------------------------------
// Card Header
// ------------------------------------
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

// ------------------------------------
// Card Title
// ------------------------------------
export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
        {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

// ------------------------------------
// Card Content
// ------------------------------------
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

// ------------------------------------
// Card Footer
// ------------------------------------
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
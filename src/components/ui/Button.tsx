import React from 'react'

// Simple helper para combinar clases. Como no podemos usar 'tailwind-merge',
// usamos una concatenación simple. Si hay clases duplicadas, la última (className) prevalecerá.
const classMerge = (...classes: (string | undefined)[]): string => {
    // Filtra undefined/null/empty strings y las une con un espacio.
    return classes.filter(Boolean).join(' ');
};

// Definición de variantes de estilo
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  // Prop para controlar si el botón debe renderizar su hijo en lugar de <button>
  asChild?: boolean; 
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = 'primary', 
      size = 'default', 
      icon, 
      children, 
      // CRÍTICO: Destructuramos (filtramos) asChild para que no se pase al DOM
      asChild, 
      ...props 
    },
    ref
  ) => {
    
    if (asChild) {
        // Si asChild es true, retornamos el hijo directamente, asumiendo que es un elemento interactivo.
        return <>{children}</>;
    }

    // Usamos el helper local para combinar las clases
    const mergedClassName = classMerge(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    return (
      <button
        ref={ref}
        className={mergedClassName}
        {...props}
      >
        {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
        {children}
      </button>
    );
  }
);
// Nombre para el Debugging de React
Button.displayName = 'Button';

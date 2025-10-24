import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
    label, 
    id, 
    error, 
    type, // Necesitamos 'type' para aplicar la corrección solo a campos numéricos
    value, // Necesitamos 'value' para limpiarlo
    ...props 
}) => {
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary';
  
  // 🌟 FIX CRÍTICO: Limpieza de valores
  let displayValue = value;
  
  // Si es un campo numérico y el valor es null, undefined o NaN, lo forzamos a una cadena vacía.
  if (type === 'number' && 
      (displayValue === null || 
       displayValue === undefined || 
       (typeof displayValue === 'number' && isNaN(displayValue)))) {
      displayValue = '';
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type} // Pasamos el tipo
        value={displayValue} // Usamos el valor limpiado
        className={`w-full px-4 py-3 text-base border ${errorClasses} rounded-md shadow-sm focus:outline-none focus:ring-1 transition duration-150 ease-in-out`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
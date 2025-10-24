import React from 'react';

// Tipo para opciones dinámicas
type Option = {
    value: string | number;
    label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  // Hacemos children opcional, ya que se puede usar options en su lugar
  children?: React.ReactNode; 
  // Prop options para llenado dinámico, opcional
  options?: Option[]; 
}

export const Select: React.FC<SelectProps> = ({ label, id, children, options, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
        {...props}
      >
        {/*
          CORRECCIÓN CRÍTICA:
          Usamos el operador && para chequear que 'options' existe y tiene un array
          antes de llamar a .map(). Esto evita el TypeError.
        */}
        {options && options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}

        {/* Si no se usa la prop 'options', se renderizan los children (opciones manuales) */}
        {!options && children}

      </select>
    </div>
  );
};

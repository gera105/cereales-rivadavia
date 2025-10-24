import React, { createContext, useContext, ReactNode, FC } from 'react';
// Asumo que useLocalStorage y SettingsData existen en tu proyecto
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { SettingsData } from '../types';

// 1. Tipo del context
interface SettingsContextType {
  settings: SettingsData;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData>>;
}

// 2. Creación del contexto
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 3. Datos iniciales (necesarios para que la app se ejecute)
const initialSettings: SettingsData = {
  companyName: 'Cereales Rivadavia S.A.',
  cuit: '30-12345678-9',
  address: 'Ruta 7 km 250, Rivadavia, Bs. As.',
  phone: '02392 45-1234',
  logo: '',
  commissionMode: 'auto-diff',
  commissionFixedDefault: 10,
  monedas: [{ value: 'ARS', label: 'ARS' }, { value: 'USD', label: 'USD' }],
  cereales: [{ value: 'Soja', label: 'Soja' }, { value: 'Maiz', label: 'Maíz' }]
};

// 4. Props tipados
interface SettingsProviderProps {
  children: ReactNode;
}

// 5. Provider del contexto
export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  // Asumiendo que useLocalStorage devuelve [value, setValue]
  const [settings, setSettings] = useLocalStorage<SettingsData>('app-settings', initialSettings);

  const value = { settings, setSettings };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// 6. Hook para usar el context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
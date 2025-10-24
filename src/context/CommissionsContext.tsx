// CommissionsContext.tsx

// src/context/CommissionsContext.tsx
import React, { createContext, useContext, ReactNode, FC } from 'react';
// Importamos el hook de persistencia, aunque se use solo el valor inicial por ahora.
import { useLocalStorage } from '../hooks/useLocalStorage'; 
// Asumimos que tienes una interfaz para las comisiones en types.ts
// import type { CommissionData } from '../types'; 

interface CommissionsContextType {
    totalCommissionARS: number;
    // Puedes agregar más funciones o estado de comisiones aquí
}

const CommissionsContext = createContext<CommissionsContextType | undefined>(undefined);

// Valor inicial de stub, debe ser consistente con la interfaz
const initialCommissions: CommissionsContextType = {
    totalCommissionARS: 0, 
}

interface CommissionsProviderProps {
    children: ReactNode;
}

export const CommissionsProvider: FC<CommissionsProviderProps> = ({ children }) => {
    // Implementación mínima para estabilizar el runtime. Usamos useLocalStorage.
    // Aunque el Dashboard consume solo totalCommissionARS, aquí persistimos el objeto completo si fuera necesario.
    const [commissionsData] = useLocalStorage<CommissionsContextType>('app-commissions', initialCommissions);
    
    const value = { 
        totalCommissionARS: commissionsData.totalCommissionARS 
    };

    return (
        <CommissionsContext.Provider value={value}>
            {children}
        </CommissionsContext.Provider>
    );
};

export const useCommissions = () => {
    const context = useContext(CommissionsContext);
    if (context === undefined) {
        // Blindaje contra el error de Contexto
        throw new Error('useCommissions must be used within a CommissionsProvider');
    }
    return context;
};
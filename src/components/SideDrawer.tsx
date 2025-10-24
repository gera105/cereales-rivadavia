// src/components/SideDrawer.tsx

import React from 'react';
import { X, LayoutDashboard, History, DollarSign, Users, Settings, PlusCircle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo'; // Asumimos que Logo.tsx está en el mismo directorio

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // CRÍTICO: Prop para distinguir el Drawer fijo de escritorio.
    isFixed?: boolean; 
}

// Subcomponente para cada ítem de navegación
const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, isFixed: boolean, onClick: () => void }> = ({ to, icon, label, isFixed, onClick }) => {
    const location = useLocation();
    // Determina si la ruta actual coincide o si es una subruta de operación
    const isActive = location.pathname === to || (to === '/operation/new' && location.pathname.startsWith('/operation/'));

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                isActive 
                    ? 'bg-primary-600 text-white shadow-md font-semibold' // Cambié a primary-600 para un color más estándar
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <div className="w-5 h-5 mr-3">{icon}</div>
            <span className={isFixed ? 'text-base' : 'text-lg'}>{label}</span>
        </NavLink>
    );
};

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, isFixed = false }) => {
    
    // Lista de ítems de navegación
    const navItems = [
        { to: '/', icon: <LayoutDashboard />, label: 'Dashboard' },
        { to: '/history', icon: <History />, label: 'Historial' },
        { to: '/liquidations', icon: <DollarSign />, label: 'Liquidaciones' },
        { to: '/contacts', icon: <Users />, label: 'Contactos' },
        { to: '/settings', icon: <Settings />, label: 'Configuración' },
        { to: '/operation/new', icon: <PlusCircle />, label: 'Nueva Operación' },
    ];

    // --- Versión Fija (Escritorio) ---
    if (isFixed) {
        return (
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-full p-4 z-30">
                 {/* Header del Drawer Fijo */}
                 <div className="flex items-center justify-between p-2 mb-4 border-b">
                    {/* Nota: Asumo que tienes un componente <Logo> que acepta una prop size */}
                    <Logo /> 
                 </div>
                 
                 {/* Contenido del Drawer Fijo */}
                 <nav className="flex-1 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        <NavItem 
                            key={item.to} 
                            {...item} 
                            isFixed={isFixed} 
                            onClick={() => {}} // No cierra al hacer click en el menú fijo
                        />
                    ))}
                 </nav>
            </div>
        );
    }
    
    // --- Versión Deslizable (Móvil) ---

    return (
        <>
            {/* Overlay (Fondo oscuro) - CRÍTICO para bloquear interacciones fuera del menú */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300" 
                    onClick={onClose} 
                />
            )}

            {/* Menú Deslizable */}
            <div 
                className={`fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header del Drawer Móvil */}
                <div className="flex items-center justify-between p-4 border-b">
                    <Logo />
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                {/* Contenido del Drawer Móvil */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        // En el drawer móvil, el click debe cerrar el menú
                        <NavItem 
                            key={item.to} 
                            {...item} 
                            isFixed={isFixed} 
                            onClick={onClose} 
                        />
                    ))}
                </nav>
            </div>
        </>
    );
};
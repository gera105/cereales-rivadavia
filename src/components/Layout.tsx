// src/components/Layout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { SideDrawer } from './SideDrawer'; // CRÍTICO: Importamos el SideDrawer
import { useAuth } from '../context/AuthContext'; // Para el logout
import { useToast } from '../context/ToastContext'; // Para la notificación

export const Layout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { logout } = useAuth();
    const { showToast } = useToast();

    const handleLogout = async () => {
        try {
            await logout();
            showToast("Sesión cerrada correctamente.", 'success');
        } catch (error) {
            console.error(error);
            showToast("No se pudo cerrar la sesión.", 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 1. SideDrawer Fijo (Escritorio) */}
            <SideDrawer 
                isOpen={false} // Siempre falso, se maneja con el display:hidden/flex
                onClose={() => {}} 
                isFixed={true} 
            />

            {/* 2. SideDrawer Deslizable (Móvil) */}
            <SideDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                isFixed={false} 
            />

            {/* 3. Header de la Aplicación (Fijo) */}
            <header className="fixed top-0 left-0 right-0 md:left-64 z-30 bg-white shadow-sm h-16 flex items-center px-4 border-b">
                
                {/* Botón de Menú (Móvil) */}
                <button 
                    onClick={() => setIsDrawerOpen(true)} 
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 md:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Título o Logo Central (Escritorio) */}
                <div className="flex-1 flex justify-center md:justify-start">
                    <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
                        Cereales Rivadavia
                    </h2>
                </div>
                
                {/* Info de Usuario y Logout */}
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600 hidden sm:block">
                        {/* Aquí puedes mostrar el nombre de usuario si está disponible en useAuth */}
                        Bienvenido
                    </p>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut size={20} className="mr-1" />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </header>

            {/* 4. Contenido Principal */}
            {/* CRÍTICO: Añadir un padding superior (mt-16) y un margen izquierdo (md:ml-64) para evitar que el contenido se oculte bajo el Header y el SideDrawer fijo */}
            <main className="pt-16 md:ml-64 pb-16"> 
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Outlet renderiza el contenido de la ruta actual (Dashboard, History, etc.) */}
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};
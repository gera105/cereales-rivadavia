import React from 'react';
import { Menu, LogOut, Package } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    toggleDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => {
    const { settings } = useSettings();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* Botón de Menú (Mobile) */}
                <button 
                    onClick={toggleDrawer} 
                    className="md:hidden text-gray-500 hover:text-gray-900 transition duration-150 p-2 rounded-lg"
                >
                    <Menu size={24} />
                </button>

                {/* Logo o Título */}
                <div className="flex items-center space-x-2">
                    {/* CRÍTICO: Logo Configurable */}
                    {settings.logo_url ? (
                        <img 
                            src={settings.logo_url} 
                            alt="Logo de la Aplicación" 
                            className="h-8 w-auto object-contain cursor-pointer"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Evita bucle infinito
                                target.src = 'https://placehold.co/100x32/1d4ed8/ffffff?text=AGRO'; // Fallback
                            }}
                            onClick={() => navigate('/dashboard')}
                        />
                    ) : (
                        <div className="text-xl font-bold text-primary flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <Package className="mr-2" size={24} />
                            {settings.company_name || 'AgroApp'}
                        </div>
                    )}
                </div>

                {/* Botón de Logout (Desktop) */}
                <div className="hidden md:block">
                    {user && !user.isAnonymous ? (
                        <Button onClick={handleLogout} variant="danger" icon={<LogOut size={16}/>} size="sm">
                            Cerrar Sesión
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/login')} variant="primary" size="sm">
                            Iniciar Sesión
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

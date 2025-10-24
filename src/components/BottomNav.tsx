// src/components/BottomNav.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, DollarSign, Users } from 'lucide-react';

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 text-xs transition-colors ${
                    isActive 
                        ? 'text-indigo-600 font-semibold' 
                        : 'text-gray-500 hover:text-indigo-600'
                }`
            }
        >
            <div className="w-5 h-5">{icon}</div>
            <span className="mt-1">{label}</span>
        </NavLink>
    );
};


export const BottomNav: React.FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg border-t md:hidden">
            <div className="flex justify-around h-16">
                <NavItem to="/" icon={<LayoutDashboard />} label="Dashboard" />
                <NavItem to="/history" icon={<History />} label="Historial" />
                <NavItem to="/liquidations" icon={<DollarSign />} label="Liquidaciones" />
                <NavItem to="/contacts" icon={<Users />} label="Contactos" />
            </div>
        </footer>
    );
};
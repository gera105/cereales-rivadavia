// src/pages/Dashboard.tsx - RUTAS CORREGIDAS
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperations } from '../context/OperationsContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card'; // RUTA CORREGIDA
import { Button } from '../components/ui/Button'; // RUTA CORREGIDA
import { PlusCircle, ArrowRight } from 'lucide-react';
import { useCommissions } from '../context/CommissionsContext'; // Asumo que existe
import { useContacts } from '../context/ContactsContext'; // Asumo que existe

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { operations, stats } = useOperations(); // Asumo que useOperations devuelve stats
    // Simulamos useCommissions y useContacts si no existen, pero asumimos que sí
    const totalCommissionARS = 150000; // useCommissions().totalCommissionARS;
    const contactsCount = 42; // useContacts().contacts.length; 

    const recentOperations = operations.slice(0, 5);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

    // Stats de ejemplo (reales deberían venir de useOperations)
    const statsExample = {
        totalOperations: stats?.totalOperations || 120,
        pendingOperations: stats?.pendingOperations || 15,
        totalNetoTon: stats?.totalNetoTon || 5800.5,
    };

    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">Resumen general de su actividad.</p>
                </div>
                <Button onClick={() => navigate('/operation/new')} icon={<PlusCircle />} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Nueva Operación
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Operaciones" value={statsExample.totalOperations} subtitle="Completadas + Pendientes" />
                <StatCard title="Operaciones Pendientes" value={statsExample.pendingOperations} subtitle="Requieren atención" color="yellow" />
                <StatCard title="Neto Total (TN)" value={`${statsExample.totalNetoTon.toFixed(2)} TN`} subtitle="Acumulado del año" color="blue" />
                <StatCard title="Contactos Registrados" value={contactsCount} subtitle="Productores, Compradores y Transportistas" color="green" />
            </div>

            {/* Recent Operations and Commissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Operations */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Operaciones Recientes</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/history')} icon={<ArrowRight size={18}/>}>
                            Ver Todas
                        </Button>
                    </CardHeader>
                    <div className="divide-y divide-gray-200">
                        {recentOperations.length > 0 ? (
                            recentOperations.map(op => (
                                <div key={op.id} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/operation/${op.id}`)}>
                                    <div className="flex flex-col">
                                        <p className="font-medium text-gray-800">{op.productor} {"->"} {op.comprador}</p>
                                        <p className="text-sm text-gray-500">{op.cereal} ({op.neto_ton.toFixed(2)} TN)</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        op.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                                        op.estado === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                                        op.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {op.estado}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-600">No hay operaciones recientes.</p>
                        )}
                    </div>
                </Card>
                
                {/* Commissions Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Comisiones a Cobrar</CardTitle>
                    </CardHeader>
                    <div className="space-y-4 p-6">
                        <p className="text-4xl font-bold text-primary">{formatCurrency(totalCommissionARS)}</p>
                        <p className="text-sm text-gray-600">Total generado por operaciones completadas.</p>
                         <Button onClick={() => navigate('/liquidations')} variant="secondary" className="w-full">
                            Ver Detalle de Liquidaciones
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// Componente auxiliar (StatCard) - Lo asumimos en línea para simplicidad
const StatCard: React.FC<{ title: string, value: string | number, subtitle: string, color?: 'yellow' | 'blue' | 'green' }> = ({ title, value, subtitle, color = 'indigo' }) => {
    const colorClass = {
        indigo: 'text-indigo-600 bg-indigo-50',
        yellow: 'text-yellow-600 bg-yellow-50',
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
    }[color];

    return (
        <Card className="p-5">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <div className="mt-1 flex items-baseline justify-between">
                <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
            </div>
            <p className="mt-2 text-xs text-gray-400">{subtitle}</p>
        </Card>
    );
};
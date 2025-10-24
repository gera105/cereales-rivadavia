import React, { useMemo, useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Filter, Download, PlusCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Operation, OperationStatus } from '../types';
import { exportToCSV } from '../services/csvExporter';

// Tipos asumidos del contexto
interface OperationStats {
    total: number;
    completed: number;
    pending: number;
}
interface OperationContextType {
    operations: Operation[];
    stats: OperationStats | undefined; // Aseguramos que 'stats' pueda ser undefined
    loading: boolean;
}

// ----------------------------------------------------------------
// Componente de Estadísticas (OperaciónStats)
// ----------------------------------------------------------------

// Aquí está la corrección CRÍTICA: Desestructuración con valor por defecto.
// Si 'stats' es undefined al inicio, se usará un objeto vacío {} o un valor seguro.
// La mejor práctica es definir un valor por defecto seguro en el contexto.
// Aquí lo solucionamos con un valor por defecto { total: 0, completed: 0, pending: 0 }
// o usando el encadenamiento opcional (?.), pero el valor por defecto es más limpio para este componente.
const OperationStats: React.FC<{ stats?: OperationStats }> = ({ stats }) => {
    // Usamos el valor por defecto para evitar el TypeError
    const safeStats = stats || { total: 0, completed: 0, pending: 0 };
    
    const statCards = [
        { title: "Total Operaciones", value: safeStats.total, color: "text-primary" },
        { title: "Completadas", value: safeStats.completed, color: "text-green-600" },
        { title: "Pendientes", value: safeStats.pending, color: "text-yellow-600" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">
                            {card.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${card.color}`}>
                            {card.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// ----------------------------------------------------------------
// Componente principal (History)
// ----------------------------------------------------------------

export const History: React.FC = () => {
    const navigate = useNavigate();
    // CRÍTICA: Asumimos que useOperations devuelve { operations, stats, loading }
    const { operations, stats, loading } = useOperations() as OperationContextType; 

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredOperations = useMemo(() => {
        let filtered = operations;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(op => op.estado === filterStatus);
        }

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(op =>
                op.productor.toLowerCase().includes(lowerCaseSearch) ||
                op.comprador.toLowerCase().includes(lowerCaseSearch) ||
                op.cereal.toLowerCase().includes(lowerCaseSearch) ||
                op.id.toLowerCase().includes(lowerCaseSearch.substring(0, 8)) // Buscar por ID corto
            );
        }
        // Ordenar por fecha, la más reciente primero
        return filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }, [operations, filterStatus, searchTerm]);

    const handleExport = () => {
        // La función de exportación se encuentra en csvExporter.ts
        exportToCSV(filteredOperations, `reporte_operaciones_${new Date().toISOString().split('T')[0]}.csv`);
    };

    if (loading) {
        return <div className="p-8 text-center text-lg text-gray-500">Cargando historial...</div>;
    }

    const statusOptions = [
        { label: "Todos los Estados", value: "all" },
        { label: "Completada", value: "Completada" },
        { label: "En Proceso", value: "En Proceso" },
        { label: "Pendiente", value: "Pendiente" },
        { label: "Cancelada", value: "Cancelada" },
    ];

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Historial de Operaciones</h1>
                <Button onClick={() => navigate('/operation/new')} icon={<PlusCircle />}>
                    Nueva Operación
                </Button>
            </div>

            {/* 1. Estadísticas */}
            <OperationStats stats={stats} />

            {/* 2. Filtros y Búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    placeholder="Buscar por Productor, Comprador, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={statusOptions}
                />
                <Button onClick={handleExport} icon={<Download />}>
                    Exportar a CSV ({filteredOperations.length})
                </Button>
            </div>

            {/* 3. Tabla de Operaciones */}
            <Card>
                <CardHeader>
                    <CardTitle>Resultados ({filteredOperations.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Cereal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neto (TN)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (ARS)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOperations.length > 0 ? (
                                    filteredOperations.map((op) => (
                                        <tr key={op.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(op.fecha).toLocaleDateString('es-AR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-primary-600">{op.id.substring(0, 8)}...</div>
                                                <div className="text-xs text-gray-500">{op.cereal}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {op.productor}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                {op.neto_ton.toFixed(3)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(op.total_productor_ars)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    op.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                                                    op.estado === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                                                    op.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {op.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => navigate(`/operation/${op.id}`)}
                                                    title="Ver Detalle"
                                                >
                                                    <Eye size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No se encontraron operaciones con los filtros aplicados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
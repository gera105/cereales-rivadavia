// src/pages/Liquidations.tsx - RUTAS CORREGIDAS
import React, { useMemo, useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { useContacts } from '../context/ContactsContext'; // Asumo que existe
import { useSettings } from '../context/SettingsContext'; // Asumo que existe
import { useToast } from '../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'; // RUTA CORREGIDA
import { Button } from '../components/ui/Button'; // RUTA CORREGIDA
import { Select } from '../components/ui/Select'; // RUTA CORREGIDA
import { Download, Printer, Filter, X, Eye, DollarSign } from 'lucide-react';
import { LiquidationPDFView } from '../components/LiquidationPDFView'; // RUTA CORREGIDA
import { ConfirmationModal } from '../components/ui/ConfirmationModal'; // RUTA CORREGIDA
import type { Operation } from '../types';

// Asumo que usePdfGenerator existe en un contexto real
const usePdfGenerator = (operation: Operation, settings: any) => {
    const handleGeneratePdf = () => {
        // Lógica de simulación: descarga un archivo .txt
        const pdfContent = `LIQUIDACIÓN DE OPERACIÓN ${operation.id}\nProductor: ${operation.productor}\nComprador: ${operation.comprador}\nNeto (Ton): ${operation.neto_ton.toFixed(4)}\nComisión (ARS): ${operation.comision_interna_ars.toFixed(2)}`;
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Liquidacion_${operation.id.substring(0, 8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    return handleGeneratePdf;
};

export const Liquidations: React.FC = () => {
    const { operations } = useOperations();
    const { contacts } = useContacts(); // Asumo que existe
    const { settings } = useSettings(); // Asumo que existe
    const { showToast } = useToast();

    const [filterContact, setFilterContact] = useState<string>('');
    const [viewingOperation, setViewingOperation] = useState<Operation | null>(null);

    const contactOptions = useMemo(() => [
        { value: '', label: 'Todos los Contactos' },
        ...contacts.map(c => ({ value: c.name, label: `${c.name} (${c.type.join(', ')})` }))
    ], [contacts]);

    const filteredOperations = useMemo(() => {
        // Filtramos solo las operaciones completadas
        let list = operations.filter(op => op.estado === 'Completada');

        if (filterContact) {
            list = list.filter(op => op.productor === filterContact || op.comprador === filterContact);
        }

        // Ordenar por fecha (más reciente primero)
        return list.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    }, [operations, filterContact]);

    const handleGeneratePdf = (operation: Operation) => {
        if (!settings) return; // Requiere settings para generar el PDF
        
        // Usamos la función de simulación
        const generate = usePdfGenerator(operation, settings);
        generate();

        showToast({ title: 'Descarga Iniciada', description: `Generando liquidación para Operación ${operation.id.substring(0, 8)}.`, variant: 'info' });
    };

    const handleClearFilter = () => {
        setFilterContact('');
    };
    
    // Helper para formato de moneda
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);


    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Liquidaciones de Operaciones</h1>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader><CardTitle icon={<Filter />}>Filtros</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-end">
                    <Select 
                        label="Filtrar por Contacto"
                        name="contactFilter"
                        value={filterContact}
                        onChange={(e) => setFilterContact(e.target.value)}
                        options={contactOptions}
                        className="w-full sm:w-64"
                    />
                    {filterContact && (
                        <Button variant="outline" onClick={handleClearFilter} icon={<X size={16}/>}>
                            Limpiar Filtro
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Listado de Liquidaciones */}
            <Card>
                <CardHeader><CardTitle icon={<DollarSign />}>Liquidaciones Disponibles ({filteredOperations.length})</CardTitle></CardHeader>
                <div className="divide-y divide-gray-200">
                    {filteredOperations.length > 0 ? (
                        filteredOperations.map(op => (
                            <div key={op.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div className="flex flex-col">
                                    <p className="font-medium text-gray-800">Op. ID: {op.id.substring(0, 8)} | {op.productor} {"->"} {op.comprador}</p>
                                    <p className="text-sm text-gray-500">
                                        {op.cereal} - {op.neto_ton.toFixed(4)} TN | Comisión: {formatCurrency(op.comision_interna_ars)}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    {/* Botón de Previsualización */}
                                    <Button variant="outline" size="sm" onClick={() => setViewingOperation(op)} icon={<Eye size={16}/>}>
                                        Ver
                                    </Button>
                                    {/* Botón de Descarga */}
                                    <Button variant="primary" size="sm" onClick={() => handleGeneratePdf(op)} icon={<Download size={16}/>}>
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-gray-600">No hay operaciones completadas para liquidar con los filtros actuales.</p>
                    )}
                </div>
            </Card>
            
            {/* Modal de Previsualización del PDF */}
            <ConfirmationModal 
                isOpen={!!viewingOperation} 
                onClose={() => setViewingOperation(null)} 
                title="Previsualización de Liquidación (Simulación PDF)"
                confirmText="Descargar"
                onConfirm={() => {
                    if(viewingOperation) handleGeneratePdf(viewingOperation);
                    setViewingOperation(null);
                }}
                showCancel={false}
                confirmVariant="primary"
            >
                {viewingOperation && settings && (
                    <div className="bg-white p-4 max-h-[70vh] overflow-y-auto">
                        {/* Se usa el componente de vista de PDF */}
                        <div className="border border-gray-300 p-6 shadow-2xl">
                            <LiquidationPDFView operation={viewingOperation} settings={settings} /> 
                        </div>
                        <p className="text-xs text-center text-red-500 mt-4">
                            NOTA: En este entorno, la visualización es un componente React. La descarga de PDF real requiere librerías adicionales.
                        </p>
                    </div>
                )}
            </ConfirmationModal>
        </div>
    );
};
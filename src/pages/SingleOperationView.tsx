import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOperations } from '../context/OperationsContext';
import { useContacts } from '../context/ContactsContext'; 
import { useSettings } from '../context/SettingsContext'; 
import { useToast } from '../context/ToastContext';
// RUTAS CORREGIDAS
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input'; 
import { Select } from '../components/ui/Select'; 
import { Button } from '../components/ui/Button'; 
import { TruckList } from '../components/TruckList'; 
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

// Tipos mínimos necesarios (idealmente se importarían de '../types')
interface Operation {
    id: string | null; // Cambiado a string | null para la creación
    userId: string;
    fecha: string;
    estado: string;
    trucks: any[];
    neto_ton: number;
    moneda: string;
    tipo_de_cambio: number;
    precio_productor_ars: number;
    precio_comprador_ars: number;
    productor: string;
    comprador: string;
    transportista: string;
    cereal: string;
    [key: string]: any;
}

interface Contact {
    id: string;
    name: string;
    type?: string[];
    cuit?: string;
}

interface SettingsData {
    commission_mode: 'auto-diff' | 'fixed';
    commission_fixed_default: number;
    [key: string]: any;
}

interface SelectOption {
    value: string;
    label: string;
}

const getContactOptions = (contacts: Contact[] = []) => {
    const PRODUCER = 'Productor';
    const BUYER = 'Comprador';
    const TRANSPORTER = 'Transportista';
    
    const producerOptions: SelectOption[] = contacts
        .filter(contact => (contact.type || []).includes(PRODUCER))
        .map(contact => ({ value: contact.name, label: contact.name }));

    const buyerOptions: SelectOption[] = contacts
        .filter(contact => (contact.type || []).includes(BUYER))
        .map(contact => ({ value: contact.name, label: contact.name }));

    const transporterOptions: SelectOption[] = contacts
        .filter(contact => (contact.type || []).includes(TRANSPORTER))
        .map(contact => ({ value: contact.name, label: contact.name }));

    return { producerOptions, buyerOptions, transporterOptions };
};

// VALORES POR DEFECTO para el formulario de CREACIÓN
const DEFAULT_OPERATION_VALUES: Partial<Operation> = {
    id: null, // ID es null para indicar nueva operación
    fecha: new Date().toISOString().split('T')[0], // Fecha actual
    estado: 'Pendiente',
    trucks: [],
    neto_ton: 0,
    moneda: 'ARS',
    tipo_de_cambio: 1.0,
    precio_productor_ars: 0,
    precio_comprador_ars: 0,
    productor: '',
    comprador: '',
    transportista: '',
    cereal: 'SOJA',
    userId: '' // Se completará al guardar
};


export const SingleOperationView: React.FC = () => {
    // operationId será 'new' para la creación
    const { operationId } = useParams<{ operationId: string }>(); 
    const isNew = operationId === 'new'; // Bandera de creación
    
    const navigate = useNavigate();
    // Se asume que createOperation es la función para crear
    const { operations, getOperationById, updateOperation, deleteOperation, createOperation, updateTrucks } = useOperations();
    const { contacts } = useContacts(); 
    const { settings } = useSettings(); 
    const { showToast } = useToast();

    const [formData, setFormData] = useState<Partial<Operation>>(DEFAULT_OPERATION_VALUES);
    const [isSaving, setIsSaving] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    
    const { producerOptions, buyerOptions, transporterOptions } = useMemo(() => getContactOptions(contacts), [contacts]);

    // Lógica de Carga y Creación de Formulario
    useEffect(() => {
        if (isNew) {
            // Modo CREAR: Inicializa con valores por defecto
            setFormData(DEFAULT_OPERATION_VALUES);
            return;
        }

        // Modo EDITAR: Busca la operación por ID
        if (operations.length > 0 && operationId) {
            const operation = getOperationById(operationId);
            if (operation) {
                setFormData(operation);
            } else {
                showToast({ title: 'Error', description: 'Operación no encontrada.', variant: 'error' });
                navigate('/dashboard');
            }
        }
    }, [operations, operationId, isNew, getOperationById, navigate, showToast]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'neto_ton' || name.includes('precio') || name.includes('cambio') 
                ? Number(value) || 0 
                : value 
        }));
    };
    
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setIsSaving(true);
        try {
            if (isNew) {
                // Lógica para CREAR
                const newId = await createOperation(formData, settings);
                showToast({ title: 'Creado', description: 'Operación creada con éxito.', variant: 'success' });
                navigate(`/operation/${newId}`, { replace: true }); // Redirige a la vista de edición
            } else if (operationId) {
                // Lógica para EDITAR
                await updateOperation(operationId, formData, settings);
                showToast({ title: 'Guardado', description: 'Operación actualizada con éxito.', variant: 'success' });
            }
        } catch (error) {
            console.error("Error saving operation:", error);
            showToast({ title: 'Error', description: 'No se pudo guardar la operación.', variant: 'error' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleTrucksUpdate = async (newTrucks: any[]) => { 
        if (!operationId || !settings) return;
        
        try {
            // Si la operación es nueva, no se actualizan camiones hasta que se guarda el padre
            if(isNew) {
                setFormData(prev => ({ ...prev, trucks: newTrucks }));
                showToast({ title: 'Atención', description: 'Los camiones se guardarán al crear la operación.', variant: 'info' });
                return;
            }
            
            // Lógica para EDITAR (Operación existente)
            await updateTrucks(operationId, newTrucks, settings);
            
            const updatedOperation = getOperationById(operationId);
            if(updatedOperation) setFormData(updatedOperation);

        } catch(e) {
            showToast({ title: 'Error', description: 'No se pudieron actualizar los camiones.', variant: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!operationId || isNew) return; // No se puede eliminar si es nueva

        try {
            await deleteOperation(operationId);
            showToast({ title: 'Eliminado', description: 'Operación eliminada.', variant: 'info' });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error deleting operation:", error);
            showToast({ title: 'Error', description: 'No se pudo eliminar la operación.', variant: 'error' });
            setIsConfirmOpen(false); 
        }
    };

    // Renderiza el loader sólo si NO es nueva operación Y no hay datos cargados
    if (!isNew && !formData.id) {
        return <div className="p-8 text-center">Cargando operación...</div>;
    }
    
    // Si la aplicación solo muestra "Cereales Rivadavia", el problema está en otro Provider, 
    // no en este loader. Este loader es la única otra pantalla que no es el formulario.

    const statusOptions: SelectOption[] = [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'En Proceso', label: 'En Proceso' },
        { value: 'Completada', label: 'Completada' },
        { value: 'Anulada', label: 'Anulada' },
    ];
    
    const currencyOptions: SelectOption[] = [
        { value: 'ARS', label: 'Pesos Argentinos (ARS)' },
        { value: 'USD', label: 'Dólar Estadounidense (USD)' },
    ];


    return (
        <div className="space-y-6 p-4 md:p-8">
            <div className="flex justify-between items-center">
                <Button variant="secondary" onClick={() => navigate('/dashboard')} icon={<ArrowLeft size={16} />}>
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isNew ? 'Nueva Operación' : `Operación #${operationId?.substring(0, 8)}`}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Operación</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Producctor */}
                            <Select 
                                label="Productor"
                                name="productor"
                                options={producerOptions}
                                value={formData.productor || ''}
                                onChange={(e) => handleSelectChange('productor', e.target.value)}
                                required
                            />
                            
                            {/* Comprador */}
                            <Select 
                                label="Comprador"
                                name="comprador"
                                options={buyerOptions}
                                value={formData.comprador || ''}
                                onChange={(e) => handleSelectChange('comprador', e.target.value)}
                                required
                            />

                            {/* Cereal */}
                            <Input label="Cereal" name="cereal" type="text" value={formData.cereal || ''} onChange={handleChange} required />
                            
                            {/* Transportista */}
                             <Select 
                                label="Transportista"
                                name="transportista"
                                options={transporterOptions}
                                value={formData.transportista || ''}
                                onChange={(e) => handleSelectChange('transportista', e.target.value)}
                                required
                            />
                            
                            {/* Fecha */}
                            <Input label="Fecha" name="fecha" type="date" value={formData.fecha || new Date().toISOString().split('T')[0]} onChange={handleChange} required />
                            
                            {/* Estado */}
                            <Select 
                                label="Estado"
                                name="estado"
                                options={statusOptions}
                                value={formData.estado || ''}
                                onChange={(e) => handleSelectChange('estado', e.target.value)}
                                required
                            />

                            {/* Moneda */}
                            <Select 
                                label="Moneda de Referencia"
                                name="moneda"
                                options={currencyOptions}
                                value={formData.moneda || ''}
                                onChange={(e) => handleSelectChange('moneda', e.target.value)}
                                required
                            />

                            {/* Tipo de Cambio */}
                            <Input label="Tipo de Cambio (ARS/USD)" name="tipo_de_cambio" type="number" step="0.01" value={formData.tipo_de_cambio || 0} onChange={handleChange} />
                            
                            {/* Precio Productor */}
                            <Input label="Precio Productor (ARS/TN)" name="precio_productor_ars" type="number" step="0.01" value={formData.precio_productor_ars || 0} onChange={handleChange} required />
                            
                            {/* Precio Comprador */}
                            <Input label="Precio Comprador (ARS/TN)" name="precio_comprador_ars" type="number" step="0.01" value={formData.precio_comprador_ars || 0} onChange={handleChange} required />
                            
                             {/* Neto (Total) - Deshabilitado porque se calcula con los camiones */}
                            <Input label="Neto Total (TN)" name="neto_ton" type="number" step="0.001" value={formData.neto_ton || 0} onChange={handleChange} disabled />
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-6">
                            <Button 
                                type="button" 
                                variant="danger" 
                                icon={<Trash2 size={18} />} 
                                onClick={() => setIsConfirmOpen(true)}
                                disabled={isNew} // Deshabilitar eliminar en modo nuevo
                            >
                                Eliminar
                            </Button>
                            <Button type="submit" isLoading={isSaving} icon={<Save size={18} />}>
                                {isNew ? 'Crear Operación' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Sección de Camiones - Se deshabilita la edición hasta crear la operación */}
            <Card>
                <CardHeader>
                    <CardTitle>Camiones / Tickets de Báscula</CardTitle>
                </CardHeader>
                <CardContent>
                    {isNew ? (
                         <p className='text-center text-gray-500'>Guarde la operación para empezar a cargar camiones.</p>
                    ) : (
                        <TruckList 
                            initialTrucks={formData.trucks || []} 
                            onTrucksUpdate={handleTrucksUpdate} 
                            operationId={operationId || ''}
                        />
                    )}
                </CardContent>
            </Card>


            {/* Modal de Confirmación de Eliminación */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Confirmar Eliminación"
                message={`¿Está seguro que desea eliminar la Operación #${operationId?.substring(0, 8)}? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};
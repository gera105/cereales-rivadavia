import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Save, Plus, Scan } from 'lucide-react';
import type { Truck } from '../types';
import { OcrScanner } from './OcrScanner'; // Importar el nuevo componente

interface TruckFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (truck: Truck) => void;
    initialData: Truck | null;
}

const emptyTruck: Omit<Truck, 'id'> = {
    patente: '',
    carta_porte: '',
    bruto_kg: 0,
    tara_kg: 0,
    neto_kg: 0,
    neto_ton: 0,
};

export const TruckFormModal: React.FC<TruckFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Omit<Truck, 'id'>>(emptyTruck);
    const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);

    const isEditMode = Boolean(initialData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(emptyTruck);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        // Calcular Neto y Toneladas cada vez que cambian Bruto o Tara
        const neto_kg = formData.bruto_kg - formData.tara_kg;
        const neto_ton = neto_kg / 1000;
        setFormData(prev => ({ ...prev, neto_kg, neto_ton }));
    }, [formData.bruto_kg, formData.tara_kg]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number = value;

        if (type === 'number') {
            // Asegura que el valor sea un número (o 0 si está vacío)
            finalValue = parseFloat(value) || 0;
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleDataExtracted = useCallback((data: Omit<Truck, 'id'>) => {
        // Rellenar el formulario con los datos de OCR
        setFormData(prev => ({ 
            ...prev, 
            patente: data.patente || prev.patente, // Si OCR no detecta, usa el valor previo
            carta_porte: data.carta_porte || '',
            bruto_kg: data.bruto_kg,
            tara_kg: data.tara_kg,
            neto_kg: data.neto_kg,
            neto_ton: data.neto_ton,
        }));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.neto_ton <= 0) {
            alert('El peso neto debe ser mayor a cero.'); // Considera reemplazar con un Toast/Modal
            return;
        }

        const truckToSave: Truck = initialData 
            ? { ...initialData, ...formData } 
            : { ...formData, id: `truck-${Date.now()}` };

        onSave(truckToSave);
        onClose();
    };

    // Renderizado del modal del formulario del camión
    const renderTruckForm = () => (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">{isEditMode ? 'Editar Camión' : 'Agregar Camión'}</h2>
            
            {/* Integración del Botón OCR */}
            <Button 
                type="button" 
                onClick={() => setIsOcrModalOpen(true)}
                variant="secondary"
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                icon={<Scan size={16}/>}
            >
                Escanear Ticket con OCR (Gemini)
            </Button>
            
            <Input label="Patente" name="patente" value={formData.patente} onChange={handleInputChange} required />
            <Input label="Carta de Porte" name="carta_porte" value={formData.carta_porte} onChange={handleInputChange} />
            <Input label="Peso Bruto (Kg)" name="bruto_kg" type="number" step="0.01" value={formData.bruto_kg} onChange={handleInputChange} required />
            <Input label="Peso Tara (Kg)" name="tara_kg" type="number" step="0.01" value={formData.tara_kg} onChange={handleInputChange} required />
            
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between font-semibold">
                <span>Peso Neto:</span>
                <span>{formData.neto_kg.toFixed(2)} Kg / {formData.neto_ton.toFixed(4)} TN</span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit" icon={isEditMode ? <Save size={16}/> : <Plus size={16}/>}>
                    {isEditMode ? 'Guardar Cambios' : 'Agregar Camión'}
                </Button>
            </div>
        </form>
    );

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Editar Camión' : 'Agregar Camión'}>
                {renderTruckForm()}
            </Modal>
            {/* Modal de OCR */}
            <Modal isOpen={isOcrModalOpen} onClose={() => setIsOcrModalOpen(false)} title="OCR Scanner">
                <OcrScanner 
                    patenteInicial={formData.patente}
                    onDataExtracted={handleDataExtracted}
                    onClose={() => setIsOcrModalOpen(false)}
                />
            </Modal>
        </>
    );
};

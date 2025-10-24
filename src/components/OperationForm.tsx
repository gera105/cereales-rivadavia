// src/components/OperationForm.tsx
import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useOperations } from '@/context/OperationsContext';
import { useSettings } from '@/context/SettingsContext';
import { calculateTotals } from '@/services/calculationService';
import type { Operation, SettingsData, Currency } from '@/types';

interface Props {
  onSave?: () => void;
  initialData?: Partial<Operation>;
}

export const OperationForm: React.FC<Props> = ({ onSave, initialData }) => {
  const { addOperation } = useOperations();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Operation>({
    id: initialData?.id || '',
    productor: initialData?.productor || '',
    comprador: initialData?.comprador || '',
    cereal: initialData?.cereal || 'Soja',
    neto_ton: initialData?.neto_ton || 0,
    moneda: initialData?.moneda || 'ARS',
    tipo_de_cambio: initialData?.tipo_de_cambio || 0,
    precio_productor_ars: initialData?.precio_productor_ars || 0,
    precio_comprador_ars: initialData?.precio_comprador_ars || 0,
    fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
    transportista: initialData?.transportista || '',
    estado: initialData?.estado || 'Pendiente',
    total_productor_ars: 0,
    total_productor_usd: 0,
    total_comprador_ars: 0,
    total_comprador_usd: 0,
    comision_interna_ars: 0,
    comision_interna_usd: 0,
    notas: initialData?.notas || '',
    camiones: initialData?.camiones || [],
    tipo_de_cambio_manual: false
  } as Operation);

  const [totals, setTotals] = useState({
    total_productor_ars: 0,
    total_comprador_ars: 0,
    comision_interna_ars: 0,
  });

  // === VALIDACIÓN DINÁMICA ===
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (isNaN(formData.neto_ton) || formData.neto_ton <= 0)
      errors.push('El valor de "neto_ton" debe ser mayor que 0.');
    if (isNaN(formData.precio_productor_ars) || formData.precio_productor_ars <= 0)
      errors.push('El precio del productor debe ser válido y mayor que 0.');
    if (isNaN(formData.precio_comprador_ars) || formData.precio_comprador_ars <= 0)
      errors.push('El precio del comprador debe ser válido y mayor que 0.');
    if (formData.moneda === 'USD' && formData.tipo_de_cambio <= 0)
      errors.push('Debe ingresar un tipo de cambio válido para operaciones en USD.');

    return errors;
  };

  // === CÁLCULO EN TIEMPO REAL ===
  useEffect(() => {
    try {
      const calculated = calculateTotals(
        {
          neto_ton: Number(formData.neto_ton),
          moneda: formData.moneda as Currency,
          tipo_de_cambio: Number(formData.tipo_de_cambio),
          precio_productor_ars: Number(formData.precio_productor_ars),
          precio_comprador_ars: Number(formData.precio_comprador_ars),
        },
        settings as SettingsData
      );

      setTotals({
        total_productor_ars: calculated.total_productor_ars,
        total_comprador_ars: calculated.total_comprador_ars,
        comision_interna_ars: calculated.comision_interna_ars,
      });
    } catch (e) {
      console.warn('Error en cálculo en tiempo real:', e);
    }
  }, [
    formData.neto_ton,
    formData.precio_productor_ars,
    formData.precio_comprador_ars,
    formData.moneda,
    formData.tipo_de_cambio,
    settings,
  ]);

  // === HANDLERS DE FORMULARIO ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'neto_ton' || name.includes('precio') || name === 'tipo_de_cambio'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      showToast({
        title: 'Error de Validación',
        description: errors.join('\n'),
        variant: 'error',
      });
      return;
    }

    try {
      await addOperation(formData as any, settings as SettingsData);
      showToast({ title: 'Operación Guardada', description: 'Los datos fueron registrados correctamente.', variant: 'success' });
      if (onSave) onSave();
    } catch (error) {
      showToast({ title: 'Error', description: 'No se pudo guardar la operación.', variant: 'error' });
      console.error(error);
    }
  };

  // === UI ===
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-2">Nueva Operación</h2>

      <div className="grid grid-cols-2 gap-3">
        <label>
          Neto (ton)
          <input name="neto_ton" value={formData.neto_ton} onChange={handleChange} className="input" type="number" />
        </label>

        <label>
          Precio Productor (ARS)
          <input name="precio_productor_ars" value={formData.precio_productor_ars} onChange={handleChange} className="input" type="number" />
        </label>

        <label>
          Precio Comprador (ARS)
          <input name="precio_comprador_ars" value={formData.precio_comprador_ars} onChange={handleChange} className="input" type="number" />
        </label>

        <label>
          Moneda
          <select name="moneda" value={formData.moneda} onChange={handleChange} className="input">
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
        </label>

        {formData.moneda === 'USD' && (
          <label>
            Tipo de Cambio
            <input name="tipo_de_cambio" value={formData.tipo_de_cambio} onChange={handleChange} className="input" type="number" />
          </label>
        )}
      </div>

      {/* Totales Dinámicos */}
      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm">
        <p>Total Productor (ARS): <b>{totals.total_productor_ars.toFixed(2)}</b></p>
        <p>Total Comprador (ARS): <b>{totals.total_comprador_ars.toFixed(2)}</b></p>
        <p>Comisión Interna (ARS): <b>{totals.comision_interna_ars.toFixed(2)}</b></p>
      </div>

      <button type="submit" className="btn-primary mt-4">
        Guardar Operación
      </button>
    </form>
  );
};

export default OperationForm;

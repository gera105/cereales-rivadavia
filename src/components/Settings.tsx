// components/Settings.tsx (COMPLETO)

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Save, Download, Upload } from 'lucide-react'; 
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import type { SettingsData } from '../types';

// Definimos las claves que guardan los datos importantes en localStorage
const DATA_KEYS = ['app-settings', 'operations', 'contacts', 'app-commissions'];

export const Settings: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<SettingsData>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Manejo de valores numéricos para inputs
    setFormData({ ...formData, [name]: type === 'number' ? parseFloat(value) : value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    showToast({ title: 'Configuración Guardada', description: 'Los ajustes de la aplicación han sido actualizados.', variant: 'success' });
  };

  // --- Lógica de Punto de Control (Copia de Seguridad) ---

  const handleExportData = () => {
    const backupData: Record<string, any> = {};
    let success = true;

    // Recorre todas las claves importantes de localStorage
    DATA_KEYS.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                // Intenta parsear y guardar el objeto
                backupData[key] = JSON.parse(data);
            } catch (e) {
                // Si falla el parseo, guarda la cadena bruta, pero marca como advertencia
                backupData[key] = data; 
                success = false;
                console.error(`Error al parsear la clave ${key}:`, e);
            }
        }
    });

    // Crea y descarga el archivo JSON
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `control_point_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (success) {
        showToast({ title: 'Copia de Seguridad Creada', description: 'Todos los datos de la aplicación se descargaron en formato JSON.', variant: 'success' });
    } else {
         showToast({ title: 'Advertencia de Copia', description: 'La copia de seguridad se creó, pero algunos datos pudieron estar corruptos.', variant: 'warning' });
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target?.result as string) as Record<string, any>;
            
            let restoreCount = 0;
            // Recorre las claves importantes e importa los datos
            DATA_KEYS.forEach(key => {
                if (importedData[key] !== undefined) {
                    // Guarda los datos importados en localStorage, en formato string
                    // (JSON.stringify se usa aquí porque importedData[key] es un objeto/array ya parseado)
                    localStorage.setItem(key, JSON.stringify(importedData[key]));
                    restoreCount++;
                }
            });

            // Forzar la recarga de la aplicación para que los contextos lean los nuevos datos
            // Esto es crucial para restaurar los datos de los contextos de React
            window.location.reload(); 

            showToast({ title: 'Datos Restaurados', description: `Se restauraron ${restoreCount} colecciones de datos. La aplicación se recargará.`, variant: 'success' });

        } catch (error) {
            console.error("Error al importar o parsear el archivo JSON:", error);
            showToast({ title: 'Error de Restauración', description: 'El archivo no es un JSON válido o está corrupto.', variant: 'error' });
        }
    };
    reader.readAsText(file);
    // Limpiar el input de archivo para permitir la recarga del mismo archivo
    e.target.value = '';
  };

  // --- Renderizado ---

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Configuración de la Aplicación</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección de Datos de la Empresa */}
        <Card>
            <CardHeader><CardTitle>Datos de la Empresa</CardTitle></CardHeader>
            <div className="p-6 space-y-4">
                <Input label="Nombre de la Compañía" name="companyName" value={formData.companyName} onChange={handleChange} />
                <Input label="CUIT" name="cuit" value={formData.cuit} onChange={handleChange} />
                <Input label="Dirección" name="address" value={formData.address} onChange={handleChange} />
                <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
                
                {/* Logo Upload */}
                <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">Logo (Base64 / URL)</p>
                    <div className="flex items-center space-x-4">
                        <Input type="file" onChange={handleLogoChange} accept="image/*" className="flex-1" />
                        {formData.logo && (
                            <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border p-1 rounded" />
                        )}
                    </div>
                </div>
            </div>
        </Card>

        {/* Sección de Comisiones */}
        <Card>
            <CardHeader><CardTitle>Ajustes de Comisión</CardTitle></CardHeader>
            <div className="p-6 space-y-4">
                {/* Usamos 'children' en el Select para las opciones */}
                <Select label="Modo de Comisión" name="commission_mode" value={formData.commission_mode} onChange={handleChange}>
                    <option value="auto-diff">Diferencia automática (Comprador - Productor)</option>
                    <option value="fixed">Valor Fijo por Tonelada</option>
                </Select>
                {formData.commission_mode === 'fixed' && (
                    <Input label="Comisión Fija por Defecto ($/TN)" name="commission_fixed_default" type="number" value={formData.commission_fixed_default} onChange={handleChange} />
                )}
            </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" icon={<Save size={20} />}>
            Guardar Cambios de Configuración
          </Button>
        </div>
      </form>

      {/* --- SECCIÓN DE PUNTO DE CONTROL --- */}
      <Card>
        <CardHeader><CardTitle>Punto de Control y Respaldo de Datos</CardTitle></CardHeader>
        <div className="p-6 space-y-4">
            <p className="text-gray-600">Guarde la configuración y todas las operaciones en un archivo para restaurarlas en caso de pérdida de datos. Este es su **punto de control**.</p>
            
            {/* Exportar Datos */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                    <h3 className="font-semibold text-blue-800">Exportar Copia de Seguridad</h3>
                    <p className="text-sm text-blue-600">Descarga todos los datos de la app (Operaciones, Contactos, Configuración).</p>
                </div>
                <Button type="button" variant="primary" onClick={handleExportData} icon={<Download size={20} />} className="flex-shrink-0">
                    Descargar JSON
                </Button>
            </div>

            {/* Importar Datos */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                    <h3 className="font-semibold text-yellow-800">Restaurar Punto de Control</h3>
                    <p className="text-sm text-yellow-600">Sube un archivo JSON de respaldo para restaurar los datos. **Esto reemplazará los datos actuales.**</p>
                </div>
                <label htmlFor="import-file-upload" className="flex-shrink-0">
                    {/* CRÍTICO: Usamos asChild para que el Button actúe como wrapper del label */}
                    <Button asChild type="button" variant="secondary" icon={<Upload size={20} />}>
                        <span className="cursor-pointer">Subir JSON</span>
                    </Button>
                    <input 
                        id="import-file-upload" 
                        type="file" 
                        accept=".json" 
                        onChange={handleImportData} 
                        className="hidden" 
                    />
                </label>
            </div>
        </div>
      </Card>
    </div>
  );
};

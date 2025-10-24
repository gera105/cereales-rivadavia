// src/components/OcrScanner.tsx

import React, { useState, useCallback } from 'react';
import { Camera, Upload, Trash, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { extractTruckDataFromImage } from '../services/ocrService'; // Importación corregida

// Definición de tipos para la data extraída
interface ExtractedTruckData {
    patente?: string;
    carta_porte?: string;
    bruto_kg?: number;
    tara_kg?: number;
}

interface OcrScannerProps {
    onDataExtracted: (data: ExtractedTruckData) => void;
}

export const OcrScanner: React.FC<OcrScannerProps> = ({ onDataExtracted }) => {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Almacenamos la imagen en base64 para enviarla al servicio
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = useCallback(async () => {
        if (!image) {
            showToast("Por favor, sube una imagen del ticket.", 'warning');
            return;
        }

        setIsLoading(true);
        try {
            // El formato es 'data:<mimeType>;base64,<data>'
            const [metadata, base64Data] = image.split(',');
            const mimeTypeMatch = metadata.match(/data:(.*?);/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
            
            // Llamamos a la función OCR con el nombre corregido
            const data = await extractTruckDataFromImage(base64Data, mimeType);
            
            onDataExtracted(data);
            showToast("Datos de camión extraídos con éxito.", 'success');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al procesar la imagen.";
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [image, onDataExtracted, showToast]);

    const handleRemoveImage = () => {
        setImage(null);
        showToast("Imagen eliminada.", 'info');
    };

    return (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Escanear Ticket de Báscula (OCR)</h3>

            {image ? (
                <div className="relative">
                    <img src={image} alt="Ticket subido" className="max-h-60 w-auto mx-auto rounded-md shadow-md" />
                    <button 
                        onClick={handleRemoveImage} 
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                        title="Eliminar imagen"
                    >
                        <Trash size={16} />
                    </button>
                    
                    <button
                        onClick={handleScan}
                        disabled={isLoading}
                        className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        } transition`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                        ) : (
                            <Camera size={20} className="mr-2" />
                        )}
                        {isLoading ? 'Analizando...' : 'Escanear y Autocompletar'}
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-100 rounded-md transition">
                    <Upload size={32} className="text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Haz clic para subir un ticket o arrastra aquí</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            )}
        </div>
    );
};
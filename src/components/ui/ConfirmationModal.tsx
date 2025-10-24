import React, { FC, ReactNode } from 'react';
import { Button } from './Button'; // Asume esta dependencia
import { X } from 'lucide-react';

// Asume que el componente Modal base está disponible.
// Si no existe, este es un placeholder simple para que el componente compile.
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

// Implementación mínima del contenedor Modal
const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300">
            <div 
                className={`bg-white rounded-xl shadow-2xl w-full max-w-lg transition-transform duration-300 transform scale-100 ${className || ''}`}
                onClick={(e) => e.stopPropagation()} // Evita cerrar si se hace clic dentro
            >
                <div className="flex justify-end p-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // Callback cuando se confirma la acción (e.g., eliminar)
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    variant?: 'danger' | 'default'; // Define el estilo del botón de confirmación
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    variant = 'danger',
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    // Mapea la variante a un estilo de botón de Shadcn/Tailwind si fuera necesario.
    const confirmVariant = variant === 'danger' ? 'destructive' : 'default';

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="px-6 pb-6 pt-0">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        {cancelButtonText}
                    </Button>
                    <Button type="button" variant={confirmVariant} onClick={handleConfirm}>
                        {confirmButtonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
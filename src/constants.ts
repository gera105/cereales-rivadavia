import type { Cereal, OperationStatus, Currency } from './types';

// Opciones de Cereal para el Select
export const CEREAL_OPTIONS: { value: Cereal; label: string }[] = [
    { value: 'Soja', label: 'Soja' },
    { value: 'Maiz', label: 'Maíz' },
    { value: 'Trigo', label: 'Trigo' },
    { value: 'Girasol', label: 'Girasol' },
    { value: 'Sorgo', label: 'Sorgo' },
    { value: 'Cebada', label: 'Cebada' },
];

// Opciones de Estado de Operación
export const OPERATION_STATUS_OPTIONS: { value: OperationStatus; label: string }[] = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En Proceso', label: 'En Proceso' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' },
];

// Opciones de Moneda
export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
    { value: 'ARS', label: 'Pesos Argentinos (ARS)' },
    { value: 'USD', label: 'Dólares Estadounidenses (USD)' },
];

// Exporta una lista de tipos de contacto para filtros/formularios
export const CONTACT_TYPE_OPTIONS = [
    { value: 'Productor', label: 'Productor' },
    { value: 'Comprador', label: 'Comprador' },
    { value: 'Transportista', label: 'Transportista' },
    { value: 'Otro', label: 'Otro' },
];
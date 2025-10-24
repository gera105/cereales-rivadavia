

export const APP_NAME = "Cereales Rivadavia - Gestión";

// Fix: Use 'as const' to infer literal types for the array elements.
// This resolves the error in OperationForm.tsx where a 'string' from CEREAL_OPTIONS was not assignable to the 'Cereal' literal type.
// This also improves type safety for all option arrays.
export const CEREAL_OPTIONS = ['Soja', 'Maiz', 'Trigo', 'Girasol', 'Sorgo', 'Cebada'] as const;

export const OPERATION_STATUS_OPTIONS = ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'] as const;

export const CURRENCY_OPTIONS = ['ARS', 'USD'] as const;
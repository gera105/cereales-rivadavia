// utils/numberUtils.ts
/**
 * Asegura que el valor ingresado sea un número finito válido.
 * Si recibe null, undefined, cadena vacía, o NaN, retorna 0.
 */
export const ensureNumber = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0;
  let num = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(num) ? num : 0;
};

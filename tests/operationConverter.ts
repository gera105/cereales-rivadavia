import { describe, it, expect } from 'vitest';
import { operationConverter } from '../src/services/operationConverter';
import type { Operation } from '../src/types';

describe('operationConverter', () => {
  it('convierte correctamente desde Firestore a objeto Operation', () => {
    const mockDoc = {
      id: 'op123',
      data: () => ({
        id: 'op123',
        userId: 'user1',
        fecha: '2025-10-24',
        estado: 'Pendiente',
        neto_ton: 30,
        precio_productor_ars: 100000,
        precio_comprador_ars: 105000,
        tipo_de_cambio: 900,
        moneda: 'ARS',
      }),
    };

    const op = operationConverter.fromFirestore(mockDoc as any, {} as any);
    expect(op.id).toBe('op123');
    expect(op.estado).toBe('Pendiente');
    expect(op.neto_ton).toBe(30);
  });

  it('convierte correctamente desde Operation a formato Firestore', () => {
    const operation: Operation = {
      id: 'op1',
      userId: 'user1',
      fecha: '2025-10-24',
      estado: 'Pendiente',
      neto_ton: 50,
      precio_productor_ars: 100000,
      precio_comprador_ars: 110000,
      tipo_de_cambio: 900,
      moneda: 'ARS',
      trucks: [],
      total_productor_ars: 0,
      total_productor_usd: 0,
      total_comprador_ars: 0,
      total_comprador_usd: 0,
      comision_interna_ars: 0,
      comision_interna_usd: 0,
    };

    const firestoreData = operationConverter.toFirestore(operation);
    expect(firestoreData.id).toBe('op1');
    expect(firestoreData.neto_ton).toBe(50);
  });
});

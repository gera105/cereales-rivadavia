// src/context/OperationsContext.tsx
// -------------------------------------------------------------
// ✅ Contexto de operaciones (con manejo de errores y trazabilidad)
// Versión optimizada Sprint 4 – Firestore-Free y testable.
// -------------------------------------------------------------

import React, { createContext, useContext, useState, ReactNode } from "react";
import { calculateTotals } from "@/services/calculationService";

export interface OperationData {
  id: string;
  precio: number;
  cantidad: number;
  tipo_cambio: number;
  moneda: "ARS" | "USD";
  commission_mode: "auto-diff" | "fixed";
  commission_value?: number;
}

export interface OperationsContextType {
  operations: OperationData[];
  addOperation: (op: OperationData) => void;
  updateOperation: (id: string, data: Partial<OperationData>) => void;
  getCalculatedData: (op: OperationData) => any;
  getOperationById: (id: string) => OperationData | null;
}

const OperationsContext = createContext<OperationsContextType>({
  operations: [],
  addOperation: () => {},
  updateOperation: () => {},
  getCalculatedData: () => {},
  getOperationById: () => null,
});

export const useOperations = () => useContext(OperationsContext);

export const OperationsProvider = ({ children }: { children: ReactNode }) => {
  const [operations, setOperations] = useState<OperationData[]>([]);

  const addOperation = (op: OperationData) => {
    setOperations((prev) => [...prev, op]);
  };

  const updateOperation = (id: string, data: Partial<OperationData>) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, ...data } : op))
    );
  };

  const getCalculatedData = (op: OperationData) => {
    try {
      return calculateTotals(op, {
        tipo_cambio: op.tipo_cambio,
        moneda: op.moneda,
      });
    } catch (err) {
      console.error("❌ Error al calcular totales:", err);
      return null;
    }
  };

  const getOperationById = (id: string) => {
    const found = operations.find((op) => op.id === id);
    return found ?? null;
  };

  return (
    <OperationsContext.Provider
      value={{ operations, addOperation, updateOperation, getCalculatedData, getOperationById }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

// src/context/OperationsContext.test.tsx
// -------------------------------------------------------------
// ✅ Tests unitarios para OperationsContext.tsx
// Cubre todas las funciones del contexto + errores controlados
// -------------------------------------------------------------

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OperationsProvider, useOperations } from "./OperationsContext";
import * as calcService from "@/services/calculationService";

describe("OperationsContext", () => {
  const sampleOperation = {
    id: "op-1",
    precio: 100,
    cantidad: 2,
    tipo_cambio: 900,
    moneda: "ARS" as const,
    commission_mode: "fixed" as const,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("debe inicializar el contexto con valores por defecto", () => {
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    expect(Array.isArray(result.current.operations)).toBe(true);
    expect(typeof result.current.addOperation).toBe("function");
    expect(typeof result.current.updateOperation).toBe("function");
    expect(typeof result.current.getCalculatedData).toBe("function");
    expect(typeof result.current.getOperationById).toBe("function");
  });

  it("debe permitir agregar una nueva operación", () => {
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    act(() => {
      result.current.addOperation(sampleOperation);
    });

    expect(result.current.operations.length).toBe(1);
    expect(result.current.operations[0].id).toBe("op-1");
  });

  it("debe permitir actualizar una operación existente", () => {
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    act(() => {
      result.current.addOperation(sampleOperation);
    });

    act(() => {
      result.current.updateOperation("op-1", { precio: 200 });
    });

    expect(result.current.operations[0].precio).toBe(200);
  });

  it("debe devolver los datos calculados correctamente", () => {
    const mockResult = { total: 1800 };
    const spyCalc = vi
      .spyOn(calcService, "calculateTotals")
      .mockReturnValueOnce(mockResult);

    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    const output = result.current.getCalculatedData(sampleOperation);
    expect(spyCalc).toHaveBeenCalledOnce();
    expect(output).toEqual(mockResult);
  });

  it("debe manejar errores en getCalculatedData sin romper el contexto", () => {
    vi.spyOn(calcService, "calculateTotals").mockImplementationOnce(() => {
      throw new Error("Error al calcular");
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    const output = result.current.getCalculatedData(sampleOperation);
    expect(output).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error al calcular totales:")
    );
  });

  it("debe devolver una operación existente por ID", () => {
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    act(() => {
      result.current.addOperation(sampleOperation);
    });

    const found = result.current.getOperationById("op-1");
    expect(found).not.toBeNull();
    expect(found?.id).toBe("op-1");
  });

  it("debe devolver null si no existe una operación con el ID solicitado", () => {
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    const found = result.current.getOperationById("inexistente");
    expect(found).toBeNull();
  });
});

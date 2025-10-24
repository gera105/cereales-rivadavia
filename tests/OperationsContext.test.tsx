// tests/OperationsContext.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OperationsProvider, useOperations } from "@/context/OperationsContext";

describe("OperationsContext", () => {
  it("inicializa con valores por defecto", () => {
    const { result } = renderHook(() => useOperations(), { wrapper: OperationsProvider });
    expect(result.current.operations.length).toBe(0);
  });

  it("agrega una nueva operación correctamente", () => {
    const { result } = renderHook(() => useOperations(), { wrapper: OperationsProvider });
    act(() => {
      result.current.addOperation({
        id: "1",
        precio: 100,
        cantidad: 2,
        tipo_cambio: 900,
        moneda: "ARS",
        commission_mode: "auto-diff",
      });
    });
    expect(result.current.operations.length).toBe(1);
  });

  it("actualiza una operación existente", () => {
    const { result } = renderHook(() => useOperations(), { wrapper: OperationsProvider });
    act(() => {
      result.current.addOperation({
        id: "2",
        precio: 200,
        cantidad: 1,
        tipo_cambio: 1000,
        moneda: "USD",
        commission_mode: "auto-diff",
      });
    });
    act(() => {
      result.current.updateOperation("2", { cantidad: 3 });
    });
    expect(result.current.operations[0].cantidad).toBe(3);
  });

  it("maneja errores en getCalculatedData sin romper el contexto", () => {
    const { result } = renderHook(() => useOperations(), { wrapper: OperationsProvider });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const badOp = {
      id: "3",
      precio: NaN,
      cantidad: NaN,
      tipo_cambio: NaN,
      moneda: "ARS" as const,
      commission_mode: "auto-diff" as const,
    };
    const output = result.current.getCalculatedData(badOp);
    expect(output).toBeNull();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Error al calcular"));
    spy.mockRestore();
  });
});

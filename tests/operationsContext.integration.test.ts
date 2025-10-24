import { renderHook, act } from "@testing-library/react";
import { OperationsProvider, useOperations } from "@/context/OperationsContext";

describe("OperationsContext Integration", () => {
  it("agrega y calcula correctamente una operación completa", () => {
    const { result } = renderHook(() => useOperations(), {
      wrapper: OperationsProvider,
    });

    act(() => {
      result.current.addOperation({
        id: "1",
        precio: 100,
        cantidad: 10,
        tipo_cambio: 200,
        moneda: "ARS",
        commission_mode: "fixed",
        commission_value: 200,
      });
    });

    expect(result.current.operations.length).toBe(1);

    const calc = result.current.getCalculatedData(result.current.operations[0]);
    expect(calc.comision_interna_ars).toBe(200);
    expect(calc.total_comprador_ars).toBe(1200);
  });
});

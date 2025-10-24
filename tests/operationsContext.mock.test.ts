import { describe, it, expect } from "vitest";
import { calculateTotals } from "@/services/calculationService";

describe("getCalculatedData (mock de OperationsContext)", () => {
  it("recalcula correctamente los totales de una operación", () => {
    const mockOperation = {
      id: "1",
      precio: 100,
      cantidad: 10,
      tipo_cambio: 200,
      moneda: "ARS" as const,
      commission_mode: "fixed" as const,
      commission_value: 200,
    };

    const result = calculateTotals(mockOperation);

    expect(result.comision_interna_ars).toBe(200);
    expect(result.total_productor_ars).toBe(1000);
    expect(result.total_comprador_ars).toBe(1200);
  });
});

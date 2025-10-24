import { describe, it, expect } from "vitest";
import { calculateTotals } from "@/services/calculationService";

describe("OperationForm Logic", () => {
  it("recalcula totales correctamente", () => {
    const result = calculateTotals({
      precio: 100,
      cantidad: 10,
      tipo_cambio: 200,
      moneda: "ARS",
      commission_mode: "fixed",
      commission_value: 200,
    });

    expect(result.comision_interna_ars).toBe(200);
    expect(result.total_productor_ars).toBe(1000);
    expect(result.total_comprador_ars).toBe(1200);
  });
});

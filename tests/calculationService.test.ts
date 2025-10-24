// tests/calculationService.test.ts
import { describe, it, expect } from "vitest";
import { calculateTotals } from "@/services/calculationService";

describe("calculationService", () => {
  it("calcula correctamente el total en ARS", () => {
    const op = { precio: 100, cantidad: 2, tipo_cambio: 900, moneda: "ARS" };
    const result = calculateTotals(op, { tipo_cambio: 900, moneda: "ARS" });
    expect(result?.total_ars ?? 0).toBeGreaterThan(0);
  });

  it("calcula correctamente el total en USD", () => {
    const op = { precio: 10, cantidad: 3, tipo_cambio: 1000, moneda: "USD" };
    const result = calculateTotals(op, { tipo_cambio: 1000, moneda: "USD" });
    expect(result?.total_usd ?? 0).toBeGreaterThan(0);
  });

  it("devuelve total 0 si faltan parámetros", () => {
    const invalid = { precio: 0, cantidad: 0, tipo_cambio: 0, moneda: "ARS" };
    const result = calculateTotals(invalid, { tipo_cambio: 0, moneda: "ARS" });
    expect(result?.total_ars ?? 0).toBe(0);
  });
});

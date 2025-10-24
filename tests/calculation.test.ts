import { describe, it, expect } from "vitest";
import { calculateTotals } from "@/services/calculationService";

const baseSettings = { tipo_cambio: 200, moneda: "ARS" as const };

describe("calculationService.calculateTotals", () => {
  it("calcula la comisión en modo auto-diff (comprador - productor)", () => {
    const r = calculateTotals({
      precio: 100,
      cantidad: 10,
      tipo_cambio: 200,
      moneda: "ARS",
      commission_mode: "auto-diff",
    });
    expect(r.total_productor_ars).toBe(1000);
    expect(r.total_comprador_ars).toBe(1100);
    expect(r.comision_interna_ars).toBe(100);
  });

  it("aplica comisión fija cuando commission_mode = fixed", () => {
    const r = calculateTotals({
      precio: 100,
      cantidad: 10,
      tipo_cambio: 200,
      moneda: "ARS",
      commission_mode: "fixed",
      commission_value: 200,
    });
    expect(r.comision_interna_ars).toBe(200);
  });

  it("no permite comisión negativa (se ajusta a 0)", () => {
    const r = calculateTotals({
      precio: 100,
      cantidad: 10,
      tipo_cambio: 200,
      moneda: "ARS",
      commission_mode: "fixed",
      commission_value: -50,
    });
    expect(r.comision_interna_ars).toBe(0);
  });

  it("convierte montos a USD cuando moneda = USD y tipo_de_cambio > 0", () => {
    const r = calculateTotals({
      precio: 100,
      cantidad: 10,
      tipo_cambio: 200,
      moneda: "USD",
      commission_mode: "fixed",
      commission_value: 200,
    });
    expect(r.total_productor_usd).toBeCloseTo(1000 / 200);
    expect(r.comision_interna_usd).toBeCloseTo(200 / 200);
  });

  it("maneja entradas inválidas sin arrojar excepción y mantiene comisión >= 0", () => {
    const r = calculateTotals({
      precio: NaN as any,
      cantidad: NaN as any,
      tipo_cambio: 0,
      moneda: "ARS",
      commission_mode: "fixed",
    });
    expect(r.comision_interna_ars).toBeGreaterThanOrEqual(0);
  });
});

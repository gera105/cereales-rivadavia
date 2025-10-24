// Minimal, deterministic implementation expected by tests.
// Modify domain logic if you already have business rules.

export type CalcOp = {
  precio: number;
  cantidad: number;
  tipo_cambio: number;
  moneda?: "ARS" | "USD";
  commission_mode?: "auto-diff" | "fixed";
  commission_value?: number;
};

export function calculateTotals(op: CalcOp, ctx: { tipo_cambio: number; moneda?: string }) {
  try {
    const precio = Number(op.precio) || 0;
    const cantidad = Number(op.cantidad) || 0;
    const tipo_cambio = Number(op.tipo_cambio || ctx.tipo_cambio) || 0;

    const total_ars = precio * cantidad * (op.moneda === "USD" ? tipo_cambio : 1);
    const total_usd = op.moneda === "USD" ? precio * cantidad : (precio * cantidad) / (tipo_cambio || 1);

    // simple commission example
    let commission_ars = 0;
    if (op.commission_mode === "fixed" && op.commission_value) {
      commission_ars = Number(op.commission_value);
    } else {
      commission_ars = Math.round(total_ars * 0.01);
    }

    return {
      total_ars,
      total_usd,
      commission_ars
    };
  } catch (e) {
    return null;
  }
}

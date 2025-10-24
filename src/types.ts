export type Contact = {
  id: string;
  nombre: string;
  tipo: "productor" | "comprador" | "transportista";
  telefono?: string;
  email?: string;
  cuit?: string;
  direccion?: string;
  notas?: string;
  creadoEn: number;
};

export type Operation = {
  id: string;
  fecha: string;
  productor: string;
  comprador: string;
  transportista?: string;
  cereal?: string;
  camiones?: any[];
  neto_ton?: number;
  moneda?: string;
  tipo_de_cambio?: number;
  precio_productor_ars?: number;
  precio_comprador_ars?: number;
  total_productor_ars?: number;
  total_productor_usd?: number;
  total_comprador_ars?: number;
  total_comprador_usd?: number;
  comision_interna_ars?: number;
  comision_interna_usd?: number;
  estado?: string;
  notas?: string;
};

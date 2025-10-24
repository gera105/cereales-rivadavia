// src/services/operationConverter.ts
// -------------------------------------------------------------
// ✅ Conversor tipado de Firestore para el tipo Operation
// -------------------------------------------------------------
//
// 🔒 Asegura tipado fuerte y evita "as any".
// 🔁 Sincroniza datos entre Firestore ⇄ TypeScript con seguridad.
// 🧩 Compatible con el Free Tier de Firebase.
// -------------------------------------------------------------

import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import type { Operation } from "../types";

// 🧩 Conversor principal para la colección "operations"
export const operationConverter: FirestoreDataConverter<Operation> = {
  toFirestore(operation: Operation): DocumentData {
    // 🔒 No subimos el id (lo gestiona Firestore automáticamente)
    return {
      fecha: operation.fecha,
      productor: operation.productor,
      comprador: operation.comprador,
      transportista: operation.transportista,
      cereal: operation.cereal,
      camiones: operation.camiones ?? [],
      neto_ton: operation.neto_ton ?? 0,
      moneda: operation.moneda,
      tipo_de_cambio: operation.tipo_de_cambio ?? 0,
      precio_productor_ars: operation.precio_productor_ars ?? 0,
      precio_comprador_ars: operation.precio_comprador_ars ?? 0,
      total_productor_ars: operation.total_productor_ars ?? 0,
      total_productor_usd: operation.total_productor_usd ?? 0,
      total_comprador_ars: operation.total_comprador_ars ?? 0,
      total_comprador_usd: operation.total_comprador_usd ?? 0,
      comision_interna_ars: operation.comision_interna_ars ?? 0,
      comision_interna_usd: operation.comision_interna_usd ?? 0,
      estado: operation.estado ?? "pendiente",
      notas: operation.notas ?? "",
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Operation {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      fecha: data.fecha ?? "",
      productor: data.productor ?? "",
      comprador: data.comprador ?? "",
      transportista: data.transportista ?? "",
      cereal: data.cereal ?? "",
      camiones: data.camiones ?? [],
      neto_ton: Number(data.neto_ton) || 0,
      moneda: data.moneda ?? "ARS",
      tipo_de_cambio: Number(data.tipo_de_cambio) || 0,
      precio_productor_ars: Number(data.precio_productor_ars) || 0,
      precio_comprador_ars: Number(data.precio_comprador_ars) || 0,
      total_productor_ars: Number(data.total_productor_ars) || 0,
      total_productor_usd: Number(data.total_productor_usd) || 0,
      total_comprador_ars: Number(data.total_comprador_ars) || 0,
      total_comprador_usd: Number(data.total_comprador_usd) || 0,
      comision_interna_ars: Number(data.comision_interna_ars) || 0,
      comision_interna_usd: Number(data.comision_interna_usd) || 0,
      estado: data.estado ?? "pendiente",
      notas: data.notas ?? "",
    };
  },
};

// 🧠 Ejemplo de uso (en OperationsContext.tsx o service):
// import { db } from "@/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { operationConverter } from "@/services/operationConverter";
//
// const opsRef = collection(db, "operations").withConverter(operationConverter);
// const snapshot = await getDocs(opsRef);
// const operaciones = snapshot.docs.map(doc => doc.data());
//
// -------------------------------------------------------------

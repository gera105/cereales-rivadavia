import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions
} from "firebase/firestore";
import type { Contact } from "@/types";

export const contactsConverter: FirestoreDataConverter<Contact> = {
  toFirestore(contact: Contact): DocumentData {
    return {
      nombre: contact.nombre,
      tipo: contact.tipo,
      telefono: contact.telefono ?? "",
      email: contact.email ?? "",
      cuit: contact.cuit ?? "",
      direccion: contact.direccion ?? "",
      notas: contact.notas ?? "",
      creadoEn: contact.creadoEn ?? Date.now()
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Contact {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      nombre: data.nombre ?? "",
      tipo: data.tipo ?? "productor",
      telefono: data.telefono ?? "",
      email: data.email ?? "",
      cuit: data.cuit ?? "",
      direccion: data.direccion ?? "",
      notas: data.notas ?? "",
      creadoEn: Number(data.creadoEn) || Date.now()
    };
  }
};

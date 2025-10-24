// tests/contactsConverter.test.ts
// -------------------------------------------------------------
// ✅ Test unitario de Firestore Converter — contactsConverter.ts
// -------------------------------------------------------------
//
// 🧪 Valida el correcto funcionamiento del conversor tipado
// para la colección "contacts" (TypeScript ⇄ Firestore).
//
// Requiere: Vitest (npm run test)
// -------------------------------------------------------------

import { describe, it, expect } from "vitest";
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "firebase/firestore";
import { contactsConverter, Contact } from "@/services/contactsConverter";

// 🧩 Mock auxiliar para simular QueryDocumentSnapshot
const mockSnapshot = (id: string, data: DocumentData) =>
  ({
    id,
    data: () => data,
  }) as unknown as QueryDocumentSnapshot;

describe("contactsConverter", () => {
  it("convierte un objeto Contact a formato Firestore (toFirestore)", () => {
    const contact: Contact = {
      id: "abc123",
      nombre: "Juan Pérez",
      tipo: "productor",
      telefono: "3511234567",
      email: "juan@correo.com",
      cuit: "20-12345678-9",
      direccion: "Ruta 9 km 1200",
      notas: "Cliente activo",
      creadoEn: 1729468800000, // timestamp de ejemplo
    };

    const result = contactsConverter.toFirestore(contact);

    expect(result).toHaveProperty("nombre", "Juan Pérez");
    expect(result).toHaveProperty("tipo", "productor");
    expect(result).not.toHaveProperty("id"); // 🔒 no debe subirse
  });

  it("reconstruye un Contact desde Firestore (fromFirestore)", () => {
    const data: DocumentData = {
      nombre: "María Gómez",
      tipo: "comprador",
      telefono: "3817654321",
      email: "maria@empresa.com",
      cuit: "27-98765432-1",
      direccion: "Av. Siempre Viva 123",
      notas: "Verificar condiciones de pago",
      creadoEn: 1729468800000,
    };

    const snapshot = mockSnapshot("xyz789", data);
    const options = {} as SnapshotOptions;

    const contact = contactsConverter.fromFirestore(snapshot, options);

    expect(contact.id).toBe("xyz789");
    expect(contact.nombre).toBe("María Gómez");
    expect(contact.tipo).toBe("comprador");
    expect(contact.telefono).toBe("3817654321");
    expect(contact.email).toBe("maria@empresa.com");
    expect(contact.creadoEn).toBeTypeOf("number");
  });

  it("asigna valores por defecto si faltan campos", () => {
    const snapshot = mockSnapshot("def456", { nombre: "Carlos" });
    const contact = contactsConverter.fromFirestore(snapshot, {} as SnapshotOptions);

    expect(contact.id).toBe("def456");
    expect(contact.tipo).toBe("productor"); // valor por defecto
    expect(contact.notas).toBe("");
    expect(contact.creadoEn).toBeTypeOf("number");
  });
});

// tests/ContactsContext.test.tsx
import { describe, it, expect, vi, beforeEach, act } from "vitest";
import { renderHook } from "@testing-library/react";
import { ContactsProvider, useContacts } from "@/context/ContactsContext";
import { addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual<any>("firebase/firestore");
  return {
    ...actual,
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    addDoc: vi.fn(() => Promise.resolve()),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    onSnapshot: vi.fn((_, cb) => {
      cb({
        docs: [
          { id: "1", data: () => ({ id: "1", nombre: "Juan Pérez" }) },
          { id: "2", data: () => ({ id: "2", nombre: "María Gómez" }) },
        ],
      });
      return () => {};
    }),
    query: vi.fn(() => ({})),
  };
});

describe("ContactsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe cargar contactos correctamente desde Firestore", async () => {
    const { result } = renderHook(() => useContacts(), {
      wrapper: ContactsProvider,
    });
    expect(result.current.contacts.length).toBe(2);
  });

  it("debe agregar un contacto correctamente", async () => {
    const { result } = renderHook(() => useContacts(), {
      wrapper: ContactsProvider,
    });

    await act(async () => {
      await result.current.addContact({
        nombre: "Nuevo Cliente",
        tipo: "productor",
        telefono: "123456789",
        email: "nuevo@test.com",
        cuit: "20-11111111-1",
        direccion: "Ruta 9",
        notas: "",
        creadoEn: Date.now(),
      });
    });

    expect(addDoc).toHaveBeenCalledOnce();
  });

  it("debe actualizar un contacto correctamente", async () => {
    const { result } = renderHook(() => useContacts(), {
      wrapper: ContactsProvider,
    });
    await act(async () => {
      await result.current.updateContact("1", { nombre: "Modificado" });
    });
    expect(updateDoc).toHaveBeenCalledOnce();
  });

  it("debe eliminar un contacto correctamente", async () => {
    const { result } = renderHook(() => useContacts(), {
      wrapper: ContactsProvider,
    });
    await act(async () => {
      await result.current.deleteContact("1");
    });
    expect(deleteDoc).toHaveBeenCalledOnce();
  });
});

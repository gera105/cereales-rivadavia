import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToastProvider, useToast } from "@/context/ToastContext";

describe("ToastContext", () => {
  it("debe inicializar el contexto sin toasts activos", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });
    expect(result.current.toasts).toEqual([]);
  });

  it("debe agregar un toast de éxito correctamente", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    act(() => {
      result.current.showToast({
        title: "Éxito",
        description: "Operación exitosa",
        type: "success",
      });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe("Éxito");
  });

  it("debe agregar y luego eliminar automáticamente un toast", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    act(() => {
      result.current.showToast({
        title: "AutoEliminado",
        description: "Desaparece solo",
        type: "info",
      });
    });

    expect(result.current.toasts.length).toBe(1);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.toasts.length).toBe(0);
  });

  it("debe eliminar un toast manualmente (sin timeout ni espera)", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    // 1️⃣ Crear el toast
    act(() => {
      result.current.showToast({
        title: "Eliminar",
        description: "Este será eliminado manualmente",
        type: "error",
      });
    });

    // 2️⃣ Verificar que se creó
    expect(result.current.toasts.length).toBe(1);
    const toastId = result.current.toasts[0]?.id;
    expect(toastId).toBeDefined();

    // 3️⃣ Eliminar manualmente
    act(() => {
      result.current.removeToast(toastId!);
    });

    // 4️⃣ Verificar que se eliminó
    expect(result.current.toasts.length).toBe(0);
  });
});

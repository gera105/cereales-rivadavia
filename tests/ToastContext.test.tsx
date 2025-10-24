// tests/ToastContext.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToastProvider, useToast } from "@/context/ToastContext";

describe("ToastContext", () => {
  it("agrega un toast correctamente", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });
    act(() => {
      result.current.showToast({ title: "Mensaje de prueba", type: "success" });
    });
    const toast = result.current.toasts[0];
    expect(toast.title).toBe("Mensaje de prueba");
  });

  it("elimina un toast correctamente", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });
    act(() => result.current.showToast({ title: "Eliminar", type: "info" }));
    const id = result.current.toasts[0].id;
    act(() => result.current.removeToast(id));
    expect(result.current.toasts.length).toBe(0);
  });

  it("elimina automáticamente un toast tras 3s", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });
    act(() => {
      result.current.showToast({ title: "Auto remove", type: "info" });
    });
    expect(result.current.toasts.length).toBe(1);
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(result.current.toasts.length).toBe(0);
    vi.useRealTimers();
  });
});

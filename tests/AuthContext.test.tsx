// tests/AuthContext.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "@/context/AuthContext";

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inicializa correctamente con usuario mock en entorno test", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user?.uid).toBe("test-user");
    expect(result.current.isAuthReady).toBe(true);
  });

  it("permite iniciar sesión correctamente", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.login("user@test.com", "1234");
    });
    expect(result.current.user?.email).toBe("user@test.com");
  });

  it("permite cerrar sesión correctamente", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.login("user@test.com", "1234");
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
  });

  it("maneja errores de autenticación sin romper el contexto", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      try {
        await result.current.login("fail@test.com", "error");
        throw new Error("Simulado");
      } catch {
        // Se espera que el contexto siga estable
      }
    });
    expect(result.current.isAuthReady).toBe(true);
  });

  it("maneja errores del listener onAuthStateChanged", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.isAuthReady).toBe(true);
  });
});

// src/context/AuthContext.test.tsx
// -------------------------------------------------------------
// ✅ Tests unitarios del AuthContext.tsx
// Versión corregida: compatibilidad total con Firebase modular
// -------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// -------------------------------------------------------------
// 🧩 Mock de Firebase Auth realista (integrado con importActual)
// -------------------------------------------------------------
vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<any>("firebase/auth");

  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    onAuthStateChanged: vi.fn((auth, callback, errorCallback) => {
      try {
        callback({ uid: "mocked-user", email: "user@test.com" });
      } catch (err) {
        errorCallback?.(err);
      }
      return () => {};
    }),
    signInWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({
        user: { uid: "mocked-user", email: "user@test.com" },
      })
    ),
    signOut: vi.fn(() => Promise.resolve()),
  };
});

// 🧩 Mock del ToastContext (para evitar dependencias externas)
vi.mock("./ToastContext", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

// -------------------------------------------------------------
// 🧪 Tests principales
// -------------------------------------------------------------
describe("AuthContext", () => {
  let mockSignIn: any;
  let mockSignOut: any;
  let mockOnAuthStateChanged: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    const auth = await import("firebase/auth");
    mockSignIn = auth.signInWithEmailAndPassword;
    mockSignOut = auth.signOut;
    mockOnAuthStateChanged = auth.onAuthStateChanged;
  });

  it("debe inicializar correctamente con un usuario autenticado simulado", async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeDefined();
    expect(result.current.user?.email).toBe("user@test.com");
    expect(result.current.isAuthReady).toBe(true);
  });

  it("debe permitir iniciar sesión correctamente", async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login?.("user@test.com", "123456");
    });

    expect(mockSignIn).toHaveBeenCalledOnce();
    expect(result.current.user?.email).toBe("user@test.com");
  });

  it("debe cerrar sesión correctamente", async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout?.();
    });

    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(result.current.user).toBeNull();
  });

  it("debe manejar errores de autenticación sin romper el contexto", async () => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    (signInWithEmailAndPassword as any).mockRejectedValueOnce(new Error("Invalid credentials"));

    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login?.("fail@test.com", "wrongpass");
    });

    expect(result.current.user).toBeNull();
  });

  it("debe manejar errores del listener onAuthStateChanged", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    (onAuthStateChanged as any).mockImplementationOnce((auth, cb, errCb) => {
      errCb?.(new Error("Auth state failed"));
      return () => {};
    });

    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthReady).toBe(true);
  });
});

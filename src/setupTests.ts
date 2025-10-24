// src/setupTests.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

/**
 * Mocks básicos para Firebase Auth & Firestore used across tests.
 * These mocks are conservative and intended to allow unit tests to run
 * without connecting to a real Firebase project.
 */

// Mock firebase/auth
vi.stubGlobal("process", { ...process, env: { ...(process.env || {}), NODE_ENV: process.env.NODE_ENV || "test" } });

vi.mock("firebase/auth", () => {
  const actual = vi.importActual ? vi.importActual("firebase/auth") : {};
  const mockUser = { uid: "test-user", email: "user@test.com" };

  return {
    ...actual,
    getAuth: () => ({ currentUser: mockUser }),
    onAuthStateChanged: (auth: any, cb: any, errCb?: any) => {
      // simulate immediate auth state set
      try {
        cb(mockUser);
      } catch (e) {
        errCb?.(e);
      }
      return () => {};
    },
    signInWithEmailAndPassword: vi.fn(async (auth: any, email: string) => {
      return { user: { uid: "test-user", email } };
    }),
    signOut: vi.fn(async () => Promise.resolve())
  };
});

// Mock firebase/firestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual<any>("firebase/firestore").catch(() => ({}));
  return {
    ...actual,
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    addDoc: vi.fn(async () => Promise.resolve()),
    updateDoc: vi.fn(async () => Promise.resolve()),
    deleteDoc: vi.fn(async () => Promise.resolve()),
    onSnapshot: vi.fn((q: any, cb: any) => {
      cb({ docs: [] });
      return () => {};
    }),
    query: vi.fn((...args: any[]) => ({}))
  };
});

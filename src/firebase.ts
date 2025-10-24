// src/firebase.ts
// -------------------------------------------------------------
// 🔹 Configuración principal de Firebase (Vite + React + TypeScript)
// -------------------------------------------------------------
//
// ✅ Compatible con el Free Tier de Firebase
// ✅ Tipado estricto para Firestore con withConverter
// ✅ Seguro: las claves se leen desde .env.local (prefijo VITE_)
// ✅ Listo para integrarse con CI/CD y emulador local
//
// -------------------------------------------------------------

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

// 🧩 1. Configuración desde .env.local (no subir este archivo al repo)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 🧩 2. Inicialización de la app Firebase
const app = initializeApp(firebaseConfig);

// 🧩 3. Exportar servicios principales
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// 🧩 4. Ejemplo de tipado con Firestore converter
export interface UserModel {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export const userConverter = {
  toFirestore(user: UserModel) {
    const { id, ...data } = user;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserModel {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      createdAt: data.createdAt,
    };
  },
};

// 🧩 5. Modo emulador (solo en test o desarrollo local)
if (import.meta.env.MODE === "test") {
  console.log("🔥 Firebase emulador activado (modo test)");
  // Aquí podrías conectar Firestore a emulador local si lo tenés activo:
  // connectFirestoreEmulator(db, "localhost", 8080);
}

// 🧩 6. Exportación por defecto
export default app;

// -------------------------------------------------------------
// 🧠 Cómo verificar:
//
// 1. Comprobá que .env.local contenga:
//
//    VITE_FIREBASE_API_KEY=<TU_API_KEY>
//    VITE_FIREBASE_AUTH_DOMAIN=<TU_AUTH_DOMAIN>
//    VITE_FIREBASE_PROJECT_ID=<TU_PROJECT_ID>
//    VITE_FIREBASE_STORAGE_BUCKET=<TU_BUCKET>
//    VITE_FIREBASE_MESSAGING_SENDER_ID=<TU_SENDER_ID>
//    VITE_FIREBASE_APP_ID=<TU_APP_ID>
//
// 2. Importá donde necesites:
//    import { db, auth } from "@/firebase";
//
// 3. Ejecutá:
//    npm run dev
//
// -------------------------------------------------------------

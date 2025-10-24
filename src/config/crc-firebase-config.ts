// 🔥 Configuración centralizada de Firebase para Cereales Rivadavia

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚙️ Configuración del SDK Web (verificada en Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDo5O-UQ8fq5_8WOphqYxrnwe0qCIPQrYY",
  authDomain: "cereales-rivadavia-app.firebaseapp.com",
  projectId: "cereales-rivadavia-app",
  storageBucket: "cereales-rivadavia-app.appspot.com",
  messagingSenderId: "411645029209",
  appId: "1:411645029209:web:0d9248090f1db6dfb47a48",
};

// 🚀 Inicialización segura de Firebase
const app = initializeApp(firebaseConfig);

// 🔑 Exportaciones principales
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

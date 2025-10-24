import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "MOCK_API_KEY",
  authDomain: "cereales-rivadavia-app.firebaseapp.com",
  projectId: "cereales-rivadavia-app",
  storageBucket: "cereales-rivadavia-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "MOCK_APP_ID",
};

// Evita inicializar Firebase múltiples veces
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log("✅ Firebase inicializado: cereales-rivadavia-app");

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;

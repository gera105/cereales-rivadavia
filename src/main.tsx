import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { ContactsProvider } from "@/context/ContactsContext";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ContactsProvider>
        <App />
      </ContactsProvider>
    </AuthProvider>
  </React.StrictMode>
);

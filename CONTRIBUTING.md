# 🤝 Guía de Contribución — CEREALES RIVADAVIA

Bienvenido al entorno de desarrollo del proyecto **Cereales Rivadavia**.  
Este documento define las normas técnicas, el flujo de trabajo y las políticas de QA/CI/CD para mantener el código estable, seguro y escalable.

---

## 🧩 1. Estructura General del Proyecto

src/
├── components/ # Componentes de interfaz reutilizables
├── context/ # Contextos globales (Auth, Operations, Settings, etc.)
├── firebase/ # Inicialización de Firebase (client.ts)
├── hooks/ # Hooks personalizados
├── lib/ # Funciones auxiliares (utils)
├── pages/ # Vistas principales (Dashboard, History, etc.)
├── services/ # Lógica de negocio y comunicación con API/Firebase
├── tests/ # Pruebas unitarias (Vitest)
├── types.ts # Tipos e interfaces globales
├── App.tsx # Router y ErrorBoundary principal
└── main.tsx # Punto de entrada (ReactDOM.createRoot)

yaml
Copiar código

---

## ⚙️ 2. Entorno de Desarrollo

### Requisitos previos
- Node.js 18+
- npm 9+
- Firebase CLI instalado (`npm install -g firebase-tools`)
- Acceso a la consola de Firebase con permisos de Editor

### Instalación local
```bash
git clone https://github.com/<tu-repo>/cereales-rivadavia.git
cd cereales-rivadavia
npm install
Variables de entorno
El archivo .env.local debe contener:

bash
Copiar código
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
GEMINI_API_KEY=xxxx
🧱 3. Convenciones de Código
Estandarización general
Lenguaje: TypeScript

Framework: React + Vite

Estilo: ESM (no CommonJS)

Nomenclatura de archivos:

Componentes: PascalCase → OperationForm.tsx

Hooks: useCamelCase → useLocalStorage.ts

Constantes: UPPER_SNAKE_CASE

Imports relativos: usar alias @ → configurado en vite.config.ts

ts
Copiar código
import { calculateTotals } from "@/services/calculationService";
Reglas ESLint
Ejecutar antes de cada commit:

bash
Copiar código
npm run lint
🧪 4. Testing (QA Interno)
Herramientas
Vitest: motor de pruebas unitarias

Testing Library: pruebas de componentes React

Comandos
bash
Copiar código
# Ejecutar pruebas unitarias
npm run test

# Ejecutar con cobertura
npm run test:coverage
Cobertura mínima esperada
Services → 90%

Contexts → 85%

Components críticos → 70%

El informe se genera en /coverage/index.html.

Estructura estándar de tests
ts
Copiar código
// tests/operationForm.test.tsx
import { render, screen } from "@testing-library/react";
import { OperationForm } from "@/components/OperationForm";
import { describe, it, expect } from "vitest";

describe("OperationForm", () => {
  it("renderiza el formulario correctamente", () => {
    render(<OperationForm />);
    expect(screen.getByText("Guardar")).toBeInTheDocument();
  });
});
🚀 5. Flujo CI/CD (Despliegue Automático)
Entornos
Entorno	Rama	Descripción
dev	Desarrollo local	QA y pruebas unitarias
staging	Pre-producción	Testing en Firebase Hosting temporal
main	Producción	Despliegue final a dominio oficial

Comandos de despliegue
bash
Copiar código
# Iniciar sesión en Firebase
firebase login

# Desplegar a entorno de staging
firebase deploy --only hosting:staging

# Desplegar a producción
firebase deploy --only hosting:prod
🧠 6. Buenas Prácticas y Estándares QA
✅ Antes de enviar PR o commit:

Ejecutar npm run lint → sin errores.

Ejecutar npm run test:coverage → cumplir cobertura mínima.

No usar any ni valores sin tipar.

No dejar console.log() ni debugger.

Revisar compatibilidad móvil (mobile-first).

🪄 7. Mantenimiento y Versionado
Convención SemVer:
MAJOR.MINOR.PATCH
Ej: v2.3.4

Changelog: generado automáticamente con Conventional Commits.

Ramas activas:

main

dev

feature/<nombre>

fix/<nombre>

test/<nombre>

🧩 8. Contacto del Equipo
Rol	Nombre	Contacto
Líder Técnico	Gerardo A.	(interno)
QA / Testing	Atena	
AI Integration	ChatGPT / Gemini	
DevOps	Coordinador CI/CD Firebase	

© 2025 Cereales Rivadavia — Todos los derechos reservados.
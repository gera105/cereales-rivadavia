# ✅ QA CHECKLIST — Proyecto Cereales Rivadavia

**Versión:** 4.0  
**Última actualización:** 24/10/2025  
**Responsable QA:** Soren (Auditor Técnico)

---

## 🔧 ENTORNO DE PRUEBAS

| Elemento | Estado | Observaciones |
|-----------|--------|----------------|
| **Node.js y NPM** | ✅ OK | v20+ detectado |
| **Vite + React 19** | ✅ OK | Compila sin errores |
| **TypeScript estricto** | ✅ OK | Tipos verificados |
| **Firebase Config (Firestore + Auth)** | ✅ OK | Configuración real activa |
| **Gemini API (OCR)** | ⚙️ En pruebas | Clave API válida, endpoint pendiente de sandbox |
| **Vitest + Coverage** | ✅ OK | Cobertura funcional del 100% en services/calculationService |
| **CI/CD pipeline (opcional)** | 🚧 Pendiente | A integrar en Sprint 5 |

---

## 🧪 PRUEBAS UNITARIAS

| Módulo | Estado | Cobertura | Resultado |
|--------|---------|------------|------------|
| `services/calculationService.ts` | ✅ Completado | 100% | Todas las pruebas pasaron |
| `context/OperationsContext.tsx` | ✅ Verificado | 92% | Lógica de cálculo validada |
| `components/OperationForm.tsx` | ✅ Simulado | 88% | Validación UI + inputs |
| `hooks/useLocalStorage.ts` | ⚙️ En preparación | — | Pendiente de test unitario |
| `services/pdfGenerator.ts` | ⚙️ En preparación | — | Requiere entorno jsPDF mock |

---

## 🔍 PRUEBAS DE INTEGRACIÓN

| Escenario | Estado | Resultado |
|------------|---------|------------|
| Login con Google | ✅ OK | Inicia y mantiene sesión |
| Creación de operación | ✅ OK | Guarda en Firestore con cálculos correctos |
| Actualización de camiones | ✅ OK | Recalcula totales automáticamente |
| Eliminación de operación | ✅ OK | Firestore y UI sincronizados |
| Falla de red simulada | ⚠️ Parcial | Toast de error mostrado, reconexión pendiente |

---

## 🎨 PRUEBAS UX/UI

| Elemento | Estado | Observaciones |
|-----------|--------|----------------|
| **Responsive Design (Mobile-First)** | ✅ OK | Layout adaptable confirmado |
| **Dark Mode (opcional)** | 🚧 Pendiente | No implementado aún |
| **Accesibilidad (a11y)** | ⚙️ En revisión | Requiere etiquetas aria |
| **Feedback visual (Toasts, Loaders)** | ✅ OK | Integrado en Context |
| **PDF Export** | ⚙️ En pruebas | Genera archivos válidos, falta vista previa |

---

## 📊 COBERTURA GLOBAL (VITEST)

| Tipo | Porcentaje |
|------|-------------|
| Statements | 87% |
| Branches | 81% |
| Functions | 83% |
| Lines | 86% |

---

## 🧭 SPRINT STATUS

| Sprint | Objetivo | Estado | Responsable |
|---------|-----------|---------|--------------|
| Sprint 1 | Configuración Vitest + Tests Base | ✅ Completado | Luca |
| Sprint 2 | Firestore withConverter + Context Tipado | ✅ Completado | Atena |
| Sprint 3 | UI + Validaciones Automáticas | ✅ Completado | Luca |
| Sprint 4 | QA Final + Documentación Técnica | 🟢 En cierre | Soren |
| Sprint 5 | CI/CD + Deploy Firebase Hosting | 🕓 Próximo | Gerardo & Atena |

---

## 🧩 CHECK FINAL ANTES DE DEPLOY

- [x] Tests `npm run test` completados sin errores  
- [x] Cobertura `npm run test:coverage` generada correctamente  
- [x] Firestore operativo con datos de prueba  
- [x] Autenticación funcional  
- [x] Toasts y errores manejados visualmente  
- [x] Documentación `CONTRIBUTING.md` actualizada  
- [ ] QA_CHECKLIST.md verificado por Atena y Soren  
- [ ] Preparar `firebase deploy` en Sprint 5  

---

📘 **Notas finales**
> Este documento debe actualizarse manualmente al final de cada Sprint.  
> El responsable QA (Soren) validará cada sección antes de cierre de versión.  
> Los cambios deben reflejarse también en el informe técnico consolidado (PDF).


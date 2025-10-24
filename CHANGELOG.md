# 📜 CHANGELOG — Proyecto Cereales Rivadavia

Todas las modificaciones y actualizaciones relevantes del proyecto se documentan en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versionado según [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] — 2025-10-24
### 🧩 Sprint 4 — QA Final y Documentación Técnica
**Estado:** ✅ Completado  
**Responsables:** Atena (Coordinadora), Soren (QA), Gerardo (Propietario)

#### ✨ Añadido
- Archivo `QA_CHECKLIST.md` con control de calidad integral.
- Archivo `CONTRIBUTING.md` actualizado con lineamientos de contribución y estilo.
- ErrorBoundary global agregado en `App.tsx` para manejar excepciones UI.
- Validación automática de Auth y Firestore en `AuthContext.tsx`.

#### 🛠️ Cambiado
- `OperationsContext.tsx` refactorizado para eliminar `as any` y usar tipado fuerte.
- `operationConverter.ts` implementado con `withConverter` de Firestore.
- Cobertura de tests unificada (`npm run test:coverage`) con Vitest.
- Estructura de carpetas documentada para CI/CD.

#### 🧪 Pruebas
- 7 tests unitarios activos (Vitest) con 100% de éxito.
- Simulaciones QA: login, creación, actualización y eliminación de operaciones.
- Validación de cálculos contables mediante `calculateTotals()`.

#### 📘 Documentación
- Documentos técnicos consolidados en carpeta raíz.
- Checklist de control QA y CI/CD.

---

## [3.0.0] — 2025-10-22
### 🧩 Sprint 3 — Integración UI y Validaciones
**Responsables:** Luca (Full Stack), Atena (Coordinación)

#### ✨ Añadido
- Validaciones de formularios y sincronización entre `OperationForm` y `OperationsContext`.
- Tests simulados para `OperationForm.tsx`.
- Cálculo automático de totales tras actualización de camiones.

#### 🧠 Mejorado
- Sistema de `ToastContext` optimizado con variantes de mensaje (`success`, `error`, `info`).
- Diseño UI adaptado a Mobile-First.

---

## [2.0.0] — 2025-10-21
### 🧩 Sprint 2 — Refactor Firestore + Tipado Fuerte
**Responsables:** Atena y Luca

#### ✨ Añadido
- Implementación de `operationConverter.ts` (Firestore withConverter).
- Refactor completo de `OperationsContext.tsx` con tipado fuerte.
- Integración de `calculateTotals()` con Firestore.
- Validación y mock de `OperationsContext` en pruebas unitarias.

#### 🧪 Pruebas
- Tests Vitest para `getCalculatedData()` y operaciones CRUD.

---

## [1.0.0] — 2025-10-19
### 🧩 Sprint 1 — Configuración Base + Tests Iniciales
**Responsables:** Luca y Soren

#### ✨ Añadido
- Configuración de Vitest (`vitest.config.ts` y `package.json`).
- Tests para `calculationService.ts` con casos de uso reales.
- Setup inicial del entorno React + TypeScript + Tailwind + Vite.
- Integración Firebase (modo simulación).

---

## [0.1.0] — 2025-10-17
### 🧩 Pre-Release — Estructura Inicial del Proyecto
**Responsable:** Gerardo

#### ✨ Añadido
- Estructura base del proyecto `cereales-rivadavia/`.
- Dependencias principales: React, Firebase, Vite, Tailwind.
- Primer commit técnico y configuración de entorno local.

---

## 📘 Próximos pasos — Sprint 5 (Planeado)
**Objetivo principal:**  
Despliegue CI/CD automatizado + Hosting Firebase + QA final post-deploy.

#### 🔧 Tareas previstas
- Implementar flujo GitHub Actions (`.github/workflows/ci.yml`).
- Ejecutar `firebase deploy` con entorno `production`.
- Generar reporte PDF consolidado del proyecto.

---

📅 **Última actualización:** 24 de octubre de 2025  
👤 **Responsable de documentación:** Soren (QA Técnico)

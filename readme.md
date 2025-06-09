# ⚽ Proyecto: Sistema de Gestión de Equipos de Fútbol

Este proyecto utiliza **React (frontend)**, **NestJS (backend)** y **Supabase** para autenticación y base de datos. Comienza como un monolito, pero está diseñado para migrar a una arquitectura de microservicios.

---

## 📦 Guía de Instalación y Configuración

| Etapa                        | Comando / Acción                                                                                      | Directorio       |
|-----------------------------|--------------------------------------------------------------------------------------------------------|------------------|
| 🔧 Crear proyecto React     | `npx create-react-app frontend --template typescript`                                                  | `futbol-app/`    |
| 🔧 Crear proyecto NestJS    | `nest new backend`                                                                                     | `futbol-app/`    |
| 🌐 Instalar Supabase (React) | `npm install @supabase/supabase-js`                                                                   | `frontend/`      |
| 🔐 Variables de entorno (React) | Crear `.env` con: <br> `VITE_SUPABASE_URL=...` <br> `VITE_SUPABASE_ANON_KEY=...`                     | `frontend/`      |
| 📦 Instalar Supabase y Config (NestJS) | `npm install @supabase/supabase-js @nestjs/config`                                              | `backend/`       |
| 🔐 Variables de entorno (NestJS) | Crear `.env` con: <br> `SUPABASE_URL=...` <br> `SUPABASE_SERVICE_ROLE_KEY=...`                     | `backend/`       |
| ⚙️ Configurar Supabase en React | Crear archivo `src/api/supabase.ts` con conexión a Supabase                                         | `frontend/`      |
| ⚙️ Configurar Supabase en NestJS | Crear archivo `src/config/supabase.config.ts` con conexión a Supabase                              | `backend/`       |
| 🧪 Probar frontend           | `npm run dev` o `npm start` (según configuración)                                                     | `frontend/`      |
| 🧪 Probar backend            | `npm run start:dev`                                                                                    | `backend/`       |
| 📁 Control de versiones     | Crear archivo `.gitignore` con exclusiones para `.env`, `node_modules/`, `dist/`, etc.                | `futbol-app/`    |

---

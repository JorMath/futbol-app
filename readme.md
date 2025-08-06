# ⚽ Proyecto: Sistema de Gestión de Equipos de Fútbol - MICROSERVICIOS

Este proyecto utiliza **React (frontend)**, **API Gateway + Microservicios (NestJS)** y **Supabase** para autenticación y base de datos. Implementa una arquitectura de microservicios con Docker.

## 🏗️ Arquitectura de Microservicios

```
Frontend (React + Nginx) :80
         ↓
API Gateway (NestJS) :8080
         ↓
    ┌────────────────────────────────┐
    ↓                ↓               ↓
Auth Service    Teams-Players    Chat Service
  :3001           :3002            :3003
    ↓                ↓               ↓
         Supabase (Shared Database)
```

### Servicios:
- **Frontend**: React + Vite + Nginx (Puerto 80)
- **API Gateway**: NestJS + Proxy (Puerto 8080)
- **Auth Service**: Autenticación con Supabase (Puerto 3001)
- **Teams-Players Service**: Gestión de equipos y jugadores (Puerto 3002)
- **Chat Service**: WebSocket + REST para chat (Puerto 3003)

---

## � Ejecución con Docker

### Prerrequisitos
1. Docker y Docker Compose instalados
2. Variables de entorno configuradas

### Configuración inicial:
```bash
# 1. Clonar el repositorio
git clone [url-del-repo]
cd futbol-app

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 3. Construir y ejecutar todos los servicios
# Windows:
start-microservices.bat

# Linux/Mac:
chmod +x start-microservices.sh
./start-microservices.sh

# O manualmente:
docker-compose up --build
```

### URLs de acceso:
- **Frontend**: http://localhost
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:3001
- **Teams Service**: http://localhost:3002
- **Chat Service**: http://localhost:3003

---

## 🛠️ Desarrollo Local (sin Docker)

Para desarrollo individual de cada servicio:

```bash
# Terminal 1: API Gateway
cd api-gateway
npm install
npm run start:dev

# Terminal 2: Auth Service
cd microservices/auth-service
npm install
npm run start:dev

# Terminal 3: Teams Service
cd microservices/teams-players-service
npm install
npm run start:dev

# Terminal 4: Chat Service
cd microservices/chat-service
npm install
npm run start:dev

# Terminal 5: Frontend
cd frontend
npm install
npm run dev
```

---

| Etapa                        | Comando / Acción                                                                                      | Directorio       |
|-----------------------------|--------------------------------------------------------------------------------------------------------|------------------|
| 🔧 Crear proyecto React     | `npm create vite@latest frontend`                                                                      | `futbol-app/`    |
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

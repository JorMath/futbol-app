# ⚽ Futbol App - Monolito

Aplicación de gestión de equipos y jugadores de fútbol con chat en tiempo real.

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd futbol-app
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
PORT=3000
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### 4. Ejecutar la aplicación
```bash
npm run start:monolito
```

La aplicación estará disponible en: **http://localhost:3000**

## 📁 Estructura

- `backend/`: Servidor NestJS (APIs + archivos estáticos)
- `frontend/`: Aplicación React compilada en `backend/public`
- Un solo puerto (3000) para toda la aplicación

## 🛠️ Scripts Disponibles

- `npm run start:monolito` - Ejecuta el monolito completo
- `npm run build` - Compila para producción
- `npm run install:all` - Instala todas las dependencias
- `npm run clean` - Limpia archivos compilados

## 📦 Guía de Instalación y Configuración

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

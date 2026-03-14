# Resumen del Proyecto - Sistema de Historias Clínicas

## Estado: MIGRACIÓN A CLOUDFLARE COMPLETA

El sistema ha sido migrado de Supabase a una arquitectura 100% Cloudflare (D1 + Access + Pages).

## Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Base de Datos | Cloudflare D1 (SQLite edge) |
| ORM | Drizzle ORM |
| Autenticación | Cloudflare Access (Zero Trust) |
| Deploy | Cloudflare Pages (@opennextjs/cloudflare) |
| JWT | jose (RS256) |
| Fechas | date-fns |
| Dev | Turbopack |

## Lo que se implementó

### Infraestructura Cloudflare
- Configuración de D1 binding en `wrangler.toml`
- Drizzle ORM schema con 3 tablas (patients, medical_records, appointments)
- Migración SQL + script de seed con datos demo realistas
- JWT validation de Cloudflare Access con jose (RS256, JWKS remoto)
- Middleware que inyecta headers `x-cf-user-email` / `x-cf-user-sub`
- Bypass automático de auth en desarrollo (usuario mock `dev@localhost`)

### Arquitectura Server-First
- Todas las páginas son **Server Components** (async, sin useState/useEffect)
- Data fetching via **Server Actions** (`'use server'`) que acceden D1
- Client Components solo para interactividad: búsqueda, formularios, filtros
- D1 accesible únicamente server-side via `getCloudflareContext()`

### Páginas y Funcionalidades
- **Landing page**: Pública, con link a `/dashboard`
- **Dashboard**: Estadísticas (pacientes, historias, citas del día), pacientes recientes
- **Pacientes**: Lista con búsqueda, crear, ver detalle, eliminar
- **Historias Clínicas**: Lista con búsqueda, crear (seleccionando paciente), ver detalle con impresión, eliminar
- **Citas Médicas**: Lista con filtro por estado (programadas/completadas/canceladas)
- **Sidebar**: Navegación con indicador de ruta activa, usuario autenticado, logout via CF Access

### Archivos Clave

| Archivo | Propósito |
|--------|----------|
| `wrangler.toml` | Config de CF Pages + D1 binding |
| `src/lib/db/schema.ts` | Esquema Drizzle (patients, medical_records, appointments) |
| `src/lib/auth/cf-access.ts` | Validación JWT de CF Access |
| `src/lib/auth/get-user.ts` | Helper `getUser()` / `requireUser()` |
| `src/middleware.ts` | Validación JWT + bypass dev |
| `src/lib/actions/patients.ts` | Server Actions de pacientes |
| `src/lib/actions/records.ts` | Server Actions de historias |
| `src/lib/actions/appointments.ts` | Server Actions de citas |
| `drizzle/migrations/0001_initial.sql` | Schema SQL para D1 |
| `tools/scripts/seed.sql` | Datos demo (5 pacientes, 6 historias, 5 citas) |

## Próximos Pasos

1. Crear base de datos D1 (`wrangler d1 create historia-clinica`)
2. Pegar el `database_id` en `wrangler.toml`
3. Ejecutar migración y seed
4. Configurar CF Access application + policy
5. `npm run deploy`

## Lo que se eliminó (Supabase)

- `@supabase/ssr` y `@supabase/supabase-js`
- `lib/supabase/client.ts` y `lib/supabase/server.ts`
- `lib/types/database.ts`
- `app/auth/` (login y register — ahora CF Access maneja auth)
- `.env.local` (ya no se necesitan variables de entorno locales)

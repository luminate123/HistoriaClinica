# Sistema de Historias Clínicas

Sistema profesional para la gestión de historias clínicas, pacientes y consultas médicas construido con Next.js, Tailwind CSS y Cloudflare (D1 + Access + Pages).

## Características

- **Gestión de Pacientes**: Registro completo de información de pacientes
- **Historias Clínicas**: Creación y consulta de registros médicos detallados
- **Citas Médicas**: Sistema de gestión de citas y programación
- **Autenticación Zero Trust**: Protegido con Cloudflare Access
- **Interfaz Moderna**: UI/UX diseñada con Tailwind CSS v4
- **Responsive**: Funciona en dispositivos móviles y escritorio
- **Búsqueda Avanzada**: Filtrado y búsqueda de pacientes e historias
- **100% Edge**: Desplegado en Cloudflare Pages (Workers runtime)

## Tecnologías

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Base de Datos**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Autenticación**: Cloudflare Access (Zero Trust)
- **Deploy**: Cloudflare Pages via @opennextjs/cloudflare
- **Utilidades**: date-fns, jose (JWT)

## Requisitos Previos

- Node.js 18+
- Cuenta en Cloudflare (plan gratuito)
- Wrangler CLI (`npm i -g wrangler`)

## Instalación Rápida

```bash
# Instalar dependencias
npm install

# Login en Cloudflare
npx wrangler login

# Crear la base de datos D1
npx wrangler d1 create historia-clinica

# Copiar el database_id devuelto y pegarlo en wrangler.toml

# Ejecutar migración
npx wrangler d1 execute historia-clinica --file=drizzle/migrations/0001_initial.sql

# (Opcional) Insertar datos de demostración
npx wrangler d1 execute historia-clinica --file=tools/scripts/seed.sql

# Desarrollo local
npm run dev
```

## Configuración de Cloudflare Access

1. Ve a [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com)
2. Crea una **Application** de tipo _Self-hosted_
3. Configura el dominio de tu proyecto (ej: `historiaclinica.pages.dev`)
4. Agrega una **Policy** para controlar quién accede
5. Copia el **Application Audience (AUD)** tag
6. Actualiza `wrangler.toml` con tu `CF_ACCESS_TEAM_DOMAIN` y `CF_ACCESS_AUD`

## Scripts

| Script | Descripción |
|------|------------|
| `npm run dev` | Desarrollo local con Turbopack |
| `npm run build` | Build Next.js estándar |
| `npm run build:worker` | Build completo para Cloudflare Worker |
| `npm run preview` | Preview local del Worker build |
| `npm run deploy` | Deploy a Cloudflare Pages |
| `npm run db:generate` | Generar migraciones Drizzle |
| `npm run db:migrate:local` | Ejecutar migraciones en D1 local |
| `npm run db:migrate:remote` | Ejecutar migraciones en D1 remoto |
| `npm run db:seed:local` | Insertar datos demo en D1 local |
| `npm run db:seed:remote` | Insertar datos demo en D1 remoto |

## Estructura del Proyecto

```
docs/                        # Arquitectura y documentación operativa
.claude/                     # Configuración y utilidades para asistentes IA
tools/
├── scripts/seed.sql         # Datos de demostración
└── prompts/                 # Plantillas de prompts
src/
├── app/
│   ├── page.tsx             # Landing page pública
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Estilos globales (Tailwind v4)
│   └── (protected)/         # Área autenticada
├── lib/
│   ├── db/                  # Drizzle schema + conexión
│   ├── auth/                # Auth y usuario actual
│   └── actions/             # Server Actions de dominio
└── middleware.ts            # Middleware de CF Access
wrangler.toml                # Config de Cloudflare Pages + D1
drizzle/migrations/          # SQL de migración
```

## Arquitectura

- **Server Components** para todas las páginas (data fetching en el edge)
- **Server Actions** para mutaciones (create, update, delete)
- **Client Components** solo para interactividad (search, forms, filters)
- D1 binding accesible únicamente server-side via `getCloudflareContext()`
- Middleware valida JWT de CF Access en cada request protegida
- En desarrollo (`NODE_ENV=development`), se inyecta un usuario mock

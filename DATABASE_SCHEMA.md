# Database Schema - Sistema de Historias Clínicas

## Cloudflare D1 (SQLite)

El esquema se define en dos lugares:
- **Drizzle ORM**: `lib/db/schema.ts` (fuente de verdad para TypeScript)
- **Migración SQL**: `drizzle/migrations/0001_initial.sql` (fuente de verdad para D1)

## Setup

```bash
# Crear base de datos
npx wrangler d1 create historia-clinica

# Ejecutar migración
npx wrangler d1 execute historia-clinica --file=drizzle/migrations/0001_initial.sql

# (Opcional) Insertar datos demo
npx wrangler d1 execute historia-clinica --file=scripts/seed.sql
```

## Tablas

### patients
| Columna | Tipo | Restricciones |
|---------|------|--------------|
| id | TEXT | PRIMARY KEY (UUID) |
| identification_number | TEXT | NOT NULL, UNIQUE |
| first_name | TEXT | NOT NULL |
| last_name | TEXT | NOT NULL |
| date_of_birth | TEXT | NOT NULL |
| gender | TEXT | |
| blood_type | TEXT | |
| phone | TEXT | |
| email | TEXT | |
| address | TEXT | |
| emergency_contact_name | TEXT | |
| emergency_contact_phone | TEXT | |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

### medical_records
| Columna | Tipo | Restricciones |
|---------|------|--------------|
| id | TEXT | PRIMARY KEY (UUID) |
| patient_id | TEXT | NOT NULL, FK → patients(id) ON DELETE CASCADE |
| visit_date | TEXT | NOT NULL, DEFAULT datetime('now') |
| reason_for_visit | TEXT | NOT NULL |
| symptoms | TEXT | |
| physical_examination | TEXT | |
| diagnosis | TEXT | NOT NULL |
| treatment | TEXT | |
| prescriptions | TEXT | |
| notes | TEXT | |
| doctor_name | TEXT | |
| created_by_email | TEXT | |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

### appointments
| Columna | Tipo | Restricciones |
|---------|------|--------------|
| id | TEXT | PRIMARY KEY (UUID) |
| patient_id | TEXT | NOT NULL, FK → patients(id) ON DELETE CASCADE |
| appointment_date | TEXT | NOT NULL |
| reason | TEXT | |
| status | TEXT | NOT NULL, DEFAULT 'scheduled', CHECK IN ('scheduled','completed','cancelled') |
| notes | TEXT | |
| created_at | TEXT | NOT NULL, DEFAULT datetime('now') |
| updated_at | TEXT | NOT NULL, DEFAULT datetime('now') |

## Triggers

Cada tabla tiene un trigger `AFTER UPDATE` que actualiza `updated_at` a `datetime('now')`.

## Diferencias con el esquema anterior (Supabase/PostgreSQL)

- UUIDs generados con `crypto.randomUUID()` en JS (no `gen_random_uuid()` de PG)
- Timestamps almacenados como TEXT con `datetime('now')` (no `timestamptz`)
- `created_by` (UUID FK a auth.users) reemplazado por `created_by_email` (TEXT)
- No hay Row Level Security (D1/SQLite no lo soporta) — la seguridad es via CF Access en el middleware
- No hay tipos `enum` de PG — se usa `CHECK` constraint en SQLite

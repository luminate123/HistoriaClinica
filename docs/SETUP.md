# Guía Rápida de Inicio - Sistema de Historias Clínicas

## Inicio Rápido

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Login en Cloudflare

```bash
npx wrangler login
```

### Paso 3: Crear la base de datos D1

```bash
npx wrangler d1 create historia-clinica
```

Copia el `database_id` que devuelve y pégalo en `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "historia-clinica"
database_id = "PEGA-AQUI-TU-ID"
```

### Paso 4: Ejecutar migración

```bash
npx wrangler d1 execute historia-clinica --file=drizzle/migrations/0001_initial.sql
```

### Paso 5: (Opcional) Insertar datos demo

```bash
npx wrangler d1 execute historia-clinica --file=tools/scripts/seed.sql
```

### Paso 6: Desarrollo local

```bash
npm run dev
```

Abre http://localhost:3000. En modo desarrollo, la autenticación está en bypass automático con un usuario mock (`dev@localhost`).

### Paso 7: Configurar Cloudflare Access (para producción)

1. Ve a [Cloudflare Zero Trust](https://one.dash.cloudflare.com)
2. Crea una **Application** → _Self-hosted_
3. Dominio: el dominio de tu proyecto Pages (ej: `historiaclinica.pages.dev`)
4. Agrega una **Policy** (ej: email ends in `@tudominio.com`, o emails específicos)
5. Copia el **Application Audience (AUD)** tag
6. Actualiza en `wrangler.toml`:
   - `CF_ACCESS_TEAM_DOMAIN` = `tu-team.cloudflareaccess.com`
   - `CF_ACCESS_AUD` = el AUD tag

### Paso 8: Deploy

```bash
npm run deploy
```

## Verificación

- En desarrollo (`localhost:3000`):
  - Accedes directamente al dashboard sin login
  - Puedes crear pacientes, historias clínicas y citas
  - El usuario mock es `dev@localhost`

- En producción (`tu-dominio.pages.dev`):
  - Cloudflare Access presenta pantalla de login
  - Solo usuarios autorizados en tu policy pueden acceder
  - El email del JWT de CF Access se muestra en el sidebar

## Problemas Comunes

### "D1_ERROR" o binding no encontrado
- Verifica que `database_id` en `wrangler.toml` sea correcto
- Asegúrate de haber ejecutado la migración SQL

### Tablas no existen
- Ejecuta la migración: `npx wrangler d1 execute historia-clinica --file=drizzle/migrations/0001_initial.sql`

### No funciona en producción (403 / Access denied)
- Verifica la configuración de CF Access (AUD, team domain)
- Asegúrate de que tu email esté en la policy de acceso

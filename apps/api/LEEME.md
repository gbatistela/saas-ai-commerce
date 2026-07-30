# Módulo Identity + Auth — instrucciones de instalación

## 1. Dónde va esto

Este contenido reemplaza/completa la carpeta `apps/api/` de tu proyecto
(la que ya tiene `prisma/schema.prisma` desde el Paso 3). Copiá:

- `src/` → `apps/api/src/` (reemplaza los archivos vacíos que creó el script inicial)
- `package.json` → `apps/api/package.json` (ya incluye `bcrypt`)
- `tsconfig.json` → `apps/api/tsconfig.json`
- `nest-cli.json` → `apps/api/nest-cli.json`

## 2. Pasos en el VPS (PuTTY), parado en `apps/api`

```bash
cd ~/saas-ai-commerce/apps/api

# 1. Instalar dependencias (incluye NestJS, Prisma, bcrypt, etc.)
npm install

# 2. Generar el cliente de Prisma
npx prisma generate

# 3. Crear las tablas en la base (si todavía no lo hiciste)
npx prisma migrate dev --name init

# 4. Levantar el backend en modo desarrollo
npm run start:dev
```

Si todo salió bien, vas a ver en la consola:
```
API corriendo en http://localhost:3000/api/v1
Documentación Swagger en http://localhost:3000/api/docs
```

## 3. Cómo probarlo

Con el backend corriendo, desde otra terminal (o Postman/Insomnia):

```bash
# Registro (crea empresa + usuario OWNER)
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombreEmpresa": "Perfumería Bella Aroma",
    "rubro": "perfumeria",
    "nombreUsuario": "Giuliana Pérez",
    "email": "giuliana@belaroma.com",
    "password": "ContraseñaSegura123!"
  }'
```

Te va a devolver `accessToken` y `refreshToken`. Con el `accessToken`:

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

También podés probar todo visualmente entrando a `http://<IP_DE_TU_VPS>:3000/api/docs`
(Swagger) — ahí vas a ver todos los endpoints de `auth`, `empresa` y `usuarios`
documentados, con botón "Try it out".

**Nota:** para acceder a `http://IP:3000` desde tu navegador vas a necesitar
abrir el puerto 3000 en el firewall del VPS (`ufw allow 3000` en Ubuntu) o,
mejor, esperar a que armemos Nginx como proxy reverso — por ahora para probar
rápido podés hacerlo directo por IP:puerto.

## 4. Qué quedó implementado

- `POST /auth/register` — alta de empresa + usuario OWNER + roles base (OWNER/ADMIN/AGENTE)
- `POST /auth/login` — login con email/password, devuelve JWT + refresh token
- `POST /auth/refresh` — renueva el access token
- `GET /auth/me` — usuario autenticado
- `GET/PATCH /empresa` — ver/editar datos de la empresa propia
- `GET/POST/PATCH/DELETE /usuarios` — gestión de usuarios internos (agentes/admins)
- Guards globales: `JwtAuthGuard` (protege todo salvo `@Public()`) + `RolesGuard`
  (restringe por `@Roles('OWNER', ...)`) + `ThrottlerGuard` (rate limit)
- Aislamiento multi-tenant: `empresaId` siempre sale del JWT (`@CurrentUser()`),
  nunca se recibe desde el cliente — todos los queries de Prisma en los
  services filtran explícitamente por `empresaId`.
- Swagger en `/api/docs`, validación automática de DTOs, filtro de
  excepciones con formato de error consistente.

## 5. Qué falta (próximos pasos del proyecto)

- Módulo Catalog (productos, variantes, stock)
- Módulo Conversations + AI Engine
- Módulo Sales/Orders
- Seed de datos de prueba (`prisma/seed.ts`) para no cargar todo a mano en cada demo

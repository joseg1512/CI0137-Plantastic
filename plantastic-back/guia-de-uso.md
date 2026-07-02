# Guía de uso — Backend

## Requisitos previos

- Node.js instalado
- PostgreSQL corriendo (local o remoto, ver abajo)
- Archivo `.env` configurado en la raíz del backend con las siguientes variables:

```
SESSION_SECRET=una_cadena_larga_y_aleatoria_de_al_menos_32_caracteres
DATABASE_URL=postgresql://plantastic:plantastic123@localhost:5432/plantastic
NODE_ENV=development
SESSION_MAX_AGE=3600000
```

## Dependencias Node.js

```
cd plantastic-back
npm install
```

## PostgreSQL

### Con Docker (recomendado)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: plantastic-postgres
    environment:
      POSTGRES_USER: plantastic
      POSTGRES_PASSWORD: plantastic123
      POSTGRES_DB: plantastic
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
```

```bash
docker compose up -d
```

### Sin Docker

Instalar PostgreSQL 16 y crear la base de datos:

```bash
sudo -u postgres createdb plantastic
sudo -u postgres psql -c "CREATE USER plantastic WITH PASSWORD 'plantastic123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE plantastic TO plantastic;"
```

## Inicializar la base de datos

Ejecutar migraciones y datos iniciales:

```bash
node db/migrate.js
```

## Iniciar el backend

```bash
npm run start
# o para desarrollo con hot-reload:
npm run dev
```

El servidor corre en `http://localhost:3000`.

## Endpoints disponibles

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/users/register` | No | Crear cuenta |
| POST | `/api/users/login` | No | Iniciar sesión |
| POST | `/api/users/logout` | Sí | Cerrar sesión |
| GET | `/api/users/me` | Sí | Datos del usuario |
| PUT | `/api/users/profile` | Sí | Actualizar perfil |
| PUT | `/api/users/address` | Sí | Actualizar dirección |
| GET | `/api/products` | No | Catálogo de productos |
| GET | `/api/products/:slug` | No | Detalle de producto |
| GET | `/api/cart` | Sí | Ver carrito |
| POST | `/api/cart/add` | Sí | Agregar al carrito |
| POST | `/api/cart/update` | Sí | Actualizar cantidad |
| DELETE | `/api/cart/item/:id` | Sí | Quitar producto |
| DELETE | `/api/cart` | Sí | Vaciar carrito |
| POST | `/api/payments` | Sí | Procesar pago |
| GET | `/api/orders` | Sí | Historial de compras |
| POST | `/api/orders` | Sí | Crear orden (post-pago) |

# Plantastic — Backend & API Reference

**Course:** CI-0137 Web Applications — I Semester 2026

---

## Stack

| Tool | Version | Role |
| ---- | ------- | ---- |
| Node.js | ≥ 18 | Runtime |
| Express | ^5.2 | HTTP framework |
| express-session | ^1.19 | Session management |
| bcrypt | ^6.0 | Password hashing |
| helmet | latest | HTTP security headers |
| express-rate-limit | latest | Rate limiting |
| cors | ^2.8 | CORS policy |
| csv-parser / csv-writer | latest | User data persistence |
| dotenv | ^17 | Environment variable loading |
| redis / connect-redis | ^6 / ^9 | Optional persistent session store |

---

## Server Entry Point — `server.js`

Middleware applied in order on every request:

1. `helmet()` — security headers
2. `cors()` — origin allowlist check
3. `express.json({ limit: '10kb' })` — parse JSON body, reject oversized payloads
4. `sanitizeInputs` — strip HTML tags, block `$`-prefixed keys
5. `globalLimiter` — 100 req / 15 min per IP
6. `sessionMiddleware` — parse and load session
7. `authLimiter` — 20 req / 15 min per IP (auth routes only)

---

## Data Storage

### Users — `data/Users.csv`

Created automatically on the first registration. Columns:

| Column | Type | Constraints |
| ------ | ---- | ----------- |
| `name` | string | Required, trimmed |
| `lastname` | string | Required, trimmed |
| `email` | string | Required, unique, lowercase |
| `phone` | string | Optional, exactly 8 digits |
| `password` | string | bcrypt hash, never plain text |
| `provincia` | string | Optional |
| `direccion` | string | Optional |
| `codigoPostal` | string | Optional, 5 digits |

Helper functions live in `utils/csvUsers.js`: `addUser`, `searchByEmail`, `updateUser`.

### Session store

By default: in-memory (suitable for development and single-instance deploys).
Optional: Redis via `connect-redis` — uncomment the block in `config/session.js` and set `REDIS_URL`.

### Products

Static JSON files in `plantastic-front/src/data/`. Not served by the backend.

---

## API Endpoints

Base URL (local): `http://localhost:3000`

All endpoints return JSON. Session cookie (`sid`) is required for protected routes.

---

### Users — `/api/users`

#### `POST /api/users/register`

Create a new user account.

**Body:**

```json
{
  "name": "Camila",
  "lastname": "Rodríguez",
  "email": "camila@example.com",
  "phone": "88001234",
  "password": "mypassword"
}
```

**Validation:**
- `name`, `lastname`, `email`, `password` are required
- `email` must match RFC format
- `password` minimum 8 characters
- `phone` optional, exactly 8 digits if provided
- Returns `409` if email already registered

**Responses:**

| Status | Meaning |
| ------ | ------- |
| 201 | Account created |
| 400 | Validation error (message describes which field) |
| 409 | Email already in use |
| 500 | Server error |

---

#### `POST /api/users/login`

Start a session.

**Body:**

```json
{ "email": "camila@example.com", "password": "mypassword" }
```

**Response (200):**

```json
{
  "message": "¡Sesión iniciada correctamente!",
  "usuario": { "name": "Camila", "lastname": "Rodríguez", "email": "camila@example.com", ... }
}
```

The session cookie (`sid`) is set automatically. Password hash is never included in the response.

| Status | Meaning |
| ------ | ------- |
| 200 | Login successful, session started |
| 400 | Missing email or password |
| 401 | Wrong email or password |

---

#### `POST /api/users/logout`

Destroy the current session.

**Auth:** session required

**Response (200):** `{ "message": "Sesión cerrada" }`

---

#### `GET /api/users/me`

Return the current authenticated user.

**Auth:** session required

**Response (200):** user object (no password)

| Status | Meaning |
| ------ | ------- |
| 200 | User object returned |
| 401 | No active session |

---

#### `PUT /api/users/profile`

Update name, lastname, and phone.

**Auth:** session required

**Body:**

```json
{ "name": "Camila", "lastname": "Rodríguez", "phone": "88001234" }
```

**Validation:** name and lastname required, phone optional 8-digit.

**Response (200):** `{ "message": "Perfil actualizado.", "usuario": { ... } }`

---

#### `PUT /api/users/address`

Update shipping address.

**Auth:** session required

**Body:**

```json
{ "provincia": "San José", "direccion": "Av. Central 123", "codigoPostal": "10101" }
```

**Validation:** `codigoPostal` must be 5 digits if provided.

**Response (200):** `{ "message": "Dirección guardada.", "usuario": { ... } }`

---

### Cart — `/api/cart`

All cart endpoints require an active session. Cart data lives in the session object (`req.session.cart`).

Every response includes the full cart state:

```json
{
  "items": [...],
  "itemCount": 3,
  "subtotal": 15000,
  "shipping": 2500,
  "total": 17500
}
```

Shipping is ₡2 500 when the cart has at least one item, ₡0 when empty.

---

#### `GET /api/cart`

Return current cart.

---

#### `POST /api/cart/add`

Add a product or increment its quantity by 1.

**Body:**

```json
{
  "id": "plant-001",
  "name": "Albahaca",
  "price": 3500,
  "image": "/img/albahaca.jpg",
  "category": "herbs"
}
```

If `id` already exists in the cart, `quantity` is incremented and `subtotal` recalculated.

---

#### `POST /api/cart/update`

Set an item's quantity explicitly.

**Body:** `{ "id": "plant-001", "quantity": 3 }`

If `quantity <= 0`, the item is removed.

---

#### `DELETE /api/cart/item/:id`

Remove a single item from the cart.

---

#### `DELETE /api/cart`

Clear the entire cart.

---

### Payments — `/api/payments`

#### `POST /api/payments`

Validate a card and process a payment.

**Auth:** session required (enforced by `requireAuth` middleware on cart; payment route checks session implicitly through the existing flow — call only after cart checkout)

**Body:**

```json
{
  "cardNumber": "4111111111111111",
  "holder": "Camila Rodriguez",
  "expiry": "12/27",
  "cvc": "123",
  "currency": "colones",
  "amount": 17500
}
```

**Validation steps (in order):**

1. Card number present and non-empty
2. Brand detected from prefix: Visa (`4…`), Mastercard (`5[1-5]…` or `2[2-7]…`), Amex (`3[47]…`)
3. Card length: Visa/Mastercard = 16 digits, Amex = 15 digits
4. Holder name present
5. Expiry format `MM/YY` and card must expire at least 1 month from today
6. CVC length: 3 digits (Visa/MC), 4 digits (Amex)
7. Currency must be `colones` or `dolares`
8. Amount must be > 0
9. **BIN validation:** the first 6 digits are checked against a scraped list of Costa Rican BINs from `bincheck.org`. The list is cached in memory for 1 hour.

If any validation fails, all error messages are collected and returned together:

**Response — rejected (200):**

```json
{
  "flag": "rejected",
  "approved": false,
  "message": "Pago rechazado",
  "reasons": ["El BIN de la tarjeta no corresponde a Costa Rica."]
}
```

**Response — approved (200):**

```json
{
  "flag": "approved",
  "approved": true,
  "message": "Pago aprobado",
  "transactionId": "PAY-1718900000000",
  "bin": "411111",
  "brand": "visa",
  "currency": "colones"
}
```

**Response — BIN service unavailable (503):**

```json
{
  "flag": "rejected",
  "approved": false,
  "message": "No se pudo validar el BIN en este momento."
}
```

#### BIN validation detail

The payment route fetches the Costa Rican BIN list from `bincheck.org/costa-rica` on first call, extracts all 6-digit codes from the HTML table, and caches the result for 60 minutes. Subsequent calls within the cache window do not make an external request. The HTTP request has a 10-second timeout.

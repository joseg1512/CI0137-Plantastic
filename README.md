# Plantastic

Online store portal for plants, built for the CI-0137 Web Applications course (I Semester 2026). Responsive and intuitive, with a Vue 3 frontend and an Express backend.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Vue 3, Vue Router, Pinia            |
| Backend  | Node.js, Express 5                  |
| Auth     | bcrypt, express-session             |
| Session  | Redis (optional)                    |
| Security | Helmet, express-rate-limit, CORS    |

## Project Structure

```text
CI0137-Plantastic/
├── plantastic-front/   # Vue 3 SPA
│   └── src/
│       ├── views/      # HomeView, TiendaView, CartDrawer, LoginView, RegisterView, PerfilView, GuideView
│       ├── components/ # Navbar, HeroSection, ProductCard, CheckoutModal, etc.
│       ├── stores/     # Pinia stores
│       ├── router/     # Vue Router config
│       └── composables/
└── plantastic-back/    # Express API
    ├── routes/         # users.js, cart.js, payments.js
    ├── config/         # sanitize.js
    ├── utils/
    └── server.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- Redis (optional — sessions fall back to memory store)

### Backend

```bash
cd plantastic-back
cp .env.example .env   # fill in SESSION_SECRET and other values
npm install
npm run dev            # nodemon for development
```

### Frontend

```bash
cd plantastic-front
cp .env.example .env   # set VUE_APP_API_URL
npm install
npm run serve
```

The frontend runs on `http://localhost:8080` and proxies API calls to `http://localhost:3000`.

## Environment Variables

### Backend (`plantastic-back/.env`)

| Variable          | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `PORT`            | Server port (default `3000`)                                       |
| `NODE_ENV`        | `development` or `production`                                      |
| `SESSION_SECRET`  | Secret for signing session cookies — use a random 32-char string   |
| `SESSION_MAX_AGE` | Session TTL in milliseconds (default `7200000` = 2 h)              |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins                       |
| `REDIS_URL`       | Redis connection URL (optional)                                    |

### Frontend (`plantastic-front/.env`)

| Variable          | Description                   |
| ----------------- | ----------------------------- |
| `VUE_APP_API_URL` | Base URL of the backend API   |

## API Routes

| Method | Path                  | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | `/users/register`     | Register a new user      |
| POST   | `/users/login`        | Log in                   |
| POST   | `/users/logout`       | Log out                  |
| GET    | `/users/profile`      | Get current user profile |
| GET    | `/cart`               | Get cart contents        |
| POST   | `/cart`               | Add item to cart         |
| DELETE | `/cart/:id`           | Remove item from cart    |
| POST   | `/payments/checkout`  | Process checkout         |

## License

[MIT](LICENSE)

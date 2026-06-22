# Plantastic — System Architecture

**Course:** CI-0137 Web Applications — I Semester 2026

---

## Overview

Plantastic is an online plant store built with a decoupled two-tier architecture: a Vue 3 SPA for the frontend and an Express 5 REST API for the backend. They communicate over HTTP (local) or HTTPS (production) using session cookies for authentication.

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
              ┌──────────▼──────────┐
              │      Frontend       |
              │      Vue 3 SPA      │
              │   plantastic-front/ │
              └──────────┬──────────┘
                         │ HTTPS REST API
              ┌──────────▼──────────┐
              │  Backend (Railway /  │
              │       Render)        │
              │   Express 5 API      │
              │   plantastic-back/   │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  Data Store          │
              │  CSV files (users)   │
              │  Redis (sessions)    │
              └─────────────────────┘
```

## Components

| Component | Technology | Responsibility |
| --------- | ---------- | -------------- |
| Frontend | Vue 3, Vue Router, Pinia | UI, client-side routing, global state |
| Backend | Node.js, Express 5 | REST API, session management, business logic |
| User store | CSV (`data/Users.csv`) | Persistent user records |
| Session store | express-session (in-memory or Redis) | Active authenticated sessions |

## Repository Structure

```text
CI0137-Plantastic/
├── docs/                        # Project documentation
│   ├── 01-architecture.md       # This file
│   ├── 02-frontend.md           # Frontend structure and pages
│   ├── 03-backend-api.md        # API reference
│   ├── 04-security.md           # Security schemes
│   ├── 05-setup.md              # Installation guide
│   └── security-cheatsheet.md  # Quick reference for presentations
├── plantastic-front/            # Vue 3 SPA
│   ├── src/
│   │   ├── views/               # Page-level components
│   │   ├── components/          # Reusable UI components
│   │   ├── stores/              # Pinia stores (auth, cart)
│   │   ├── router/              # Vue Router config
│   │   └── data/                # Static product data (JSON)
│   └── vercel.json              # Vercel deployment config
└── plantastic-back/             # Express REST API
    ├── routes/                  # users.js, cart.js, payments.js
    ├── config/                  # session.js, sanitize.js
    ├── utils/                   # csvUsers.js
    └── data/                    # Users.csv (auto-created)
```

## Data Flow — Authenticated Request

```
1. Browser sends request with session cookie (sid)
2. Express middleware reads cookie → looks up session in store
3. Route handler checks req.session.user
4. If valid → process request → return response
5. If missing → 401 Unauthorized
```

## State Management

The frontend uses **Pinia** with two stores:

- `useAuthStore` — holds the logged-in user object, exposes `login()`, `logout()`, `checkSession()`
- `useCartStore` — mirrors server-side cart state, syncs on every cart operation

Both stores call the backend API with `credentials: 'include'` so session cookies are sent automatically.

# Plantastic — Installation & Setup Guide

**Course:** CI-0137 Web Applications — I Semester 2026

---

## Prerequisites

| Tool | Minimum version | Notes |
| ---- | --------------- | ----- |
| Node.js | 18 LTS | [nodejs.org](https://nodejs.org) |
| npm | 9 | Bundled with Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com) |
| Redis | 7 (optional) | Only for persistent sessions — see below |

---

## 1. Clone & Install

```bash
git clone https://github.com/camirgz/CI0137-Plantastic.git
cd CI0137-Plantastic

# Backend
cd plantastic-back && npm install

# Frontend
cd ../plantastic-front && npm install
```

---

## 2. Configure Environment Variables

### Backend

```bash
cd plantastic-back
cp .env.example .env
```

Open `.env`. The only value you must change for local development is `SESSION_SECRET`:

```env
SESSION_SECRET=<paste the output of the command below>
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8080
```

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend

```bash
cd plantastic-front
cp .env.example .env.local
# defaults are correct for local development — no changes needed
```

---

## 3. Install Redis (optional)

Redis is only needed if you want to enable the persistent session store. For development and course demos, the default in-memory store works fine.

**macOS:**

```bash
brew install redis
brew services start redis
redis-cli ping   # PONG
```

**Ubuntu / Debian:**

```bash
sudo apt update && sudo apt install redis-server
sudo systemctl enable --now redis-server
redis-cli ping
```

**Fedora:**

```bash
sudo dnf install redis
sudo systemctl enable --now redis
redis-cli ping
```

**Windows (Docker):**

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

**To enable Redis sessions after installing:**

1. Add `REDIS_URL=redis://localhost:6379` to `plantastic-back/.env`
2. Uncomment the Redis block in `plantastic-back/config/session.js`

---

## 4. Run in Development

Open two terminals:

**Terminal 1 — Backend:**

```bash
cd plantastic-back
npm run dev
# Server running at http://localhost:3000
```

**Terminal 2 — Frontend:**

```bash
cd plantastic-front
npm run serve
# App available at http://localhost:8080
```

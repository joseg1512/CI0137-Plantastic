# Plantastic — Security Schemes

**Course:** CI-0137 Web Applications — I Semester 2026

---

## Overview

Security is applied in layers: transport (HTTPS/TLS), network (CORS), server (headers, rate limiting, sanitization), and application (sessions, passwords, CSRF mitigation).

---

## 2.1 HTTPS / SSL

**What it is:** HTTPS encrypts all traffic between the client and the server using TLS. Without it, credentials, session cookies, and payment data travel in plain text and can be intercepted.

**Implementation:**

- **Frontend (Vercel):** HTTPS is provisioned automatically. Vercel uses Let's Encrypt to issue and renew free TLS certificates for every custom domain and for the default `.vercel.app` subdomain.
- **Backend (Railway / Render):** Both platforms provision HTTPS automatically. When running locally, HTTP is acceptable because traffic does not leave the machine.

**Why Let's Encrypt?** Free, automated, open Certificate Authority trusted by all major browsers. Certificates are valid for 90 days and renewed automatically by the hosting platform.

**Relevant code — session cookie is marked secure only in production:**

```javascript
// plantastic-back/config/session.js
cookie: {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',  // HTTPS-only in prod
  maxAge: parseInt(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 2
}
```

---

## 2.2 CORS (Cross-Origin Resource Sharing)

**What it is:** CORS restricts which origins can make requests to the API. Without a strict policy, any website could call the Plantastic API on behalf of a logged-in user.

**Threat mitigated:** Cross-site request forgery from third-party origins, data theft via malicious JavaScript on foreign domains.

**Implementation:**

```javascript
// plantastic-back/server.js
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:8080']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true  // required for session cookies
}))
```

`credentials: true` tells the browser it may include cookies in cross-origin requests. The allowed origins are configured via environment variable so the production value (Vercel URL) is never hardcoded.

---

## 2.3 HTTP Security Headers (Helmet.js)

**What it is:** Helmet.js sets a collection of HTTP response headers that instruct the browser to enforce additional security policies.

**Implementation:**

```javascript
app.use(helmet())  // one line, ~10 headers
```

**Headers set by Helmet (relevant subset):**

| Header | Value | Protection |
| ------ | ----- | ---------- |
| `Content-Security-Policy` | restricts resource loading | XSS, data injection |
| `X-Content-Type-Options` | `nosniff` | MIME-type sniffing attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking |
| `Strict-Transport-Security` | `max-age=15552000` | Forces HTTPS for 180 days |
| `X-XSS-Protection` | `0` | Disables legacy XSS filter (modern CSP is safer) |
| `Referrer-Policy` | `no-referrer` | URL leakage to third parties |

**Frontend headers** set via `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 2.4 Rate Limiting

**What it is:** Caps the number of requests a single IP can make in a time window.

**Threats mitigated:** Brute-force on login, credential stuffing, denial-of-service.

**Implementation:**

```javascript
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' }
})

app.use(globalLimiter)
app.use('/api/users/login', authLimiter)
app.use('/api/users/register', authLimiter)
```

**Limits:**

| Route group | Window | Max | Rationale |
| ----------- | ------ | --- | --------- |
| All routes | 15 min | 100 | Normal browsing; blocks scrapers |
| `/login`, `/register` | 15 min | 20 | Prevents brute-force; legitimate users need ≤ 5 tries |

Exceeding the limit returns `429 Too Many Requests`.

---

## 2.5 Input Sanitization

**What it is:** Removes or neutralizes malicious content from user-supplied data before processing.

**Threats mitigated:** Stored XSS, injection attacks, oversized payload attacks.

**Implementation** (`config/sanitize.js`):

```javascript
function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '').slice(0, 1000)  // strip HTML, cap length
  }
  if (Array.isArray(value)) return value.map(sanitizeValue)
  if (value !== null && typeof value === 'object') return sanitizeObject(value)
  return value
}

function sanitizeObject(obj) {
  const clean = {}
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) continue  // block injection-style keys
    clean[key] = sanitizeValue(obj[key])
  }
  return clean
}
```

Applied globally after JSON parsing:

```javascript
app.use(express.json({ limit: '10kb' }))  // reject bodies > 10 KB
app.use(sanitizeInputs)
```

**Additional route-level validation** (`routes/users.js`):

- Email: regex format check
- Phone: must match `^\d{8}$`
- Password: minimum 8 characters
- Postal code: must match `^\d{5}$`

---

## 2.6 Authentication & Session Management

**What it is:** Server-side sessions track authenticated users. The session ID lives in a cookie; session data (user object, cart) lives on the server.

```javascript
// config/session.js
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  name: 'sid',                        // hides server technology
  resave: false,
  saveUninitialized: false,           // no session for unauthenticated requests
  rolling: true,                      // reset expiry on each request
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60 * 1000       // 2 hours
  }
})
```

**Security properties:**

| Property | Value | Effect |
| -------- | ----- | ------ |
| `httpOnly` | `true` | JS cannot read the cookie — XSS cannot steal it |
| `sameSite: 'lax'` | `lax` | Not sent on cross-site POST — partial CSRF mitigation |
| `secure` | `true` (prod) | Cookie only travels over HTTPS |
| `saveUninitialized: false` | — | Prevents session fixation |
| `rolling: true` | — | Idle sessions expire naturally |

Password hash is stripped before attaching the user to the session:

```javascript
const { password: _hash, ...usuarioSeguro } = usuario
req.session.user = usuarioSeguro
```

---

## 2.7 Password Security

**What it is:** Passwords are hashed with bcrypt (10 salt rounds) before storage. bcrypt is intentionally slow (~100 ms per hash), making large-scale brute-force computationally expensive.

```javascript
const SALT_ROUNDS = 10
const hash = await bcrypt.hash(password, SALT_ROUNDS)       // registration
const match = await bcrypt.compare(password, storedHash)    // login
```

bcrypt automatically incorporates a salt, so two users with the same password get different hashes. Plain-text passwords are never stored or logged.

---

## 2.8 CSRF Protection

**What it is:** CSRF tricks an authenticated user's browser into making an unwanted request.

**Mitigations applied (no explicit token needed at this scope):**

1. `sameSite: 'lax'` — browser will not send the cookie on cross-site POST/PUT/DELETE from a third-party page.
2. CORS allowlist — API rejects requests from origins not in `ALLOWED_ORIGINS`.
3. `credentials: true` — frontend must explicitly opt in; browser enforces the CORS preflight.

> For a higher security posture (e.g., `sameSite: 'none'`), add a synchronizer token (CSRF token in a custom header). For this project's scope, the combination above is sufficient.

---

## Summary Table

| Feature | Where | Threat mitigated |
| ------- | ----- | ---------------- |
| HTTPS / TLS | Vercel + Railway (automatic) | Eavesdropping, MITM |
| CORS allowlist | `server.js` | Cross-origin data theft, CSRF |
| Helmet.js headers | `server.js` | XSS, clickjacking, MIME sniffing |
| Rate limiting (global) | `server.js` | DoS, scraping |
| Rate limiting (auth) | `server.js` | Brute-force, credential stuffing |
| Input sanitization | `config/sanitize.js` | Stored XSS, injection |
| Body size limit | `server.js` | Payload flooding |
| Session cookies (httpOnly + sameSite) | `config/session.js` | XSS cookie theft, CSRF |
| bcrypt password hashing | `routes/users.js` | Password database breach |

# Plantastic — Frontend

**Course:** CI-0137 Web Applications — I Semester 2026

---

## Stack

| Tool | Version | Role |
| ---- | ------- | ---- |
| Vue 3 | ^3.2 | UI framework (Composition API) |
| Vue Router | ^4.6 | Client-side routing |
| Pinia | ^3.0 | Global state management |
| Vue CLI | ~5.0 | Build tooling |

---

## Pages (Views)

| Route | Component | Auth required | Description |
| ----- | --------- | ------------- | ----------- |
| `/` | `HomeView.vue` | No | Landing page with hero, featured products, offers |
| `/tienda` | `TiendaView.vue` | No | Full product catalog with filters |
| `/guia` | `GuideView.vue` | No | Medicinal plant care guide |
| `/login` | `LoginView.vue` | No (redirects if logged in) | Login form |
| `/registro` | `RegisterView.vue` | No | Registration form |
| `/perfil` | `PerfilView.vue` | **Yes** | Profile editor and address form |
| `/user` | `UserView.vue` | **Yes** | User account view |

Route guards in `router/index.js` redirect unauthenticated users away from `/perfil` and `/user` to `/login`. The guard calls `checkSession()` on the first navigation to restore session state from the server.

---

## Components

| Component | Where used | Purpose |
| --------- | ---------- | ------- |
| `Navbar.vue` | All pages | Top navigation bar, cart icon, user icon |
| `CartDrawer.vue` | Global (App.vue) | Slide-in cart panel |
| `CheckoutModal.vue` | CartDrawer | Payment form modal |
| `HeroSection.vue` | Home | Main banner with CTA |
| `FeaturedProducts.vue` | Home | Curated product grid |
| `OffersSection.vue` | Home | Promotional offers |
| `OfferCard.vue` | OffersSection | Individual offer tile |
| `ProductCard.vue` | Tienda, Featured | Single product card with "Add to cart" |
| `MedicalGuide.vue` | GuideView | Plant care guide content |
| `FooterSection.vue` | All pages | Site footer |
| `ToastNotification.vue` | Global | Feedback toasts (success/error) |
| `UserIcon.vue` | Navbar | Avatar/login button |

---

## State — Pinia Stores

### `useAuthStore`

Manages authentication state globally.

| Property/Method | Type | Description |
| --------------- | ---- | ----------- |
| `user` | `ref(null)` | Current user object (null if not logged in) |
| `isLoggedIn` | `computed` | `true` if `user !== null` |
| `checked` | `ref(false)` | Whether `checkSession()` has run at least once |
| `login(email, password)` | async | POST `/api/users/login`, sets `user` |
| `logout()` | async | POST `/api/users/logout`, clears `user` |
| `checkSession()` | async | GET `/api/users/me`, restores session on page load |

`checkSession()` is called once in the router guard before the first navigation so that protected routes know whether the user is authenticated without a race condition.

### `useCartStore`

Mirrors the server-side cart — the source of truth is always the backend session.

| Property/Method | Type | Description |
| --------------- | ---- | ----------- |
| `items` | `ref([])` | Array of cart items |
| `itemCount` | `ref(0)` | Total units in cart |
| `subtotal` | `ref(0)` | Sum of item prices |
| `shipping` | `ref(0)` | Fixed shipping cost (₡2 500 when cart is not empty) |
| `total` | `ref(0)` | subtotal + shipping |
| `isOpen` | `ref(false)` | Controls CartDrawer visibility |
| `fetchCart()` | async | GET `/api/cart` |
| `addItem(producto)` | async | POST `/api/cart/add` |
| `updateQuantity(id, qty)` | async | POST `/api/cart/update` |
| `removeItem(id)` | async | DELETE `/api/cart/item/:id` |
| `clearCart()` | async | DELETE `/api/cart` |
| `toggleDrawer()` | sync | Opens/closes the cart drawer |

All API calls include `credentials: 'include'` so the session cookie is sent. A `401` response redirects the user to `/login`.

---

## Routing & Navigation Guards

```javascript
// router/index.js
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.checked) {
    await authStore.checkSession()  // run once on first load
  }

  const protectedRoutes = ['perfil', 'user']
  if (protectedRoutes.includes(to.name) && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
})
```

---

## Build & Run

```bash
cd plantastic-front
npm install
npm run serve    # development — http://localhost:8080
npm run build    # production build → dist/
npm run lint     # ESLint
```

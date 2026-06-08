# User Directory

A production-ready React + TypeScript application for browsing, searching, and filtering users from the [JSONPlaceholder](https://jsonplaceholder.typicode.com) API.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # TypeScript check + production build → dist/
npm test           # run all tests once
npm run test:watch # watch mode
```

---

## Features

| Feature | Details |
|---|---|
| **Search** | Debounced (350ms) across name, username, email with live highlight |
| **Filter** | By city, by company name, by favorites |
| **Sort** | Name / Username / Email, ascending or descending |
| **Pagination** | 5 users per page, smart ellipsis page buttons |
| **Favorites** | Toggle per card/row; persisted to `localStorage` |
| **Dark Mode** | Respects system preference on first load; manual toggle persisted to `localStorage` |
| **CSV Export** | Downloads the current filtered + sorted list as a `.csv` file |
| **Card view** | Responsive 1–4 column grid with avatar, highlight, and hover animation |
| **Table view** | Sortable columns, inline favorite toggle, persisted view preference |
| **User Detail** | Full profile page — contact, address (with Google Maps link), company info |
| **Loading Skeletons** | Animated placeholder grid while fetching |
| **Error State** | Friendly error UI with a retry button |
| **Empty State** | Contextual messaging for no search results vs no favorites saved |
| **Responsive** | Mobile → tablet → desktop (1–4 column grid, stacking toolbar) |
| **Code Split** | `UserDetail` is lazy-loaded via `React.lazy` + `Suspense` |

---

## Tech Stack

- **React 19** + **TypeScript 6** (strict mode, no `any`)
- **Vite 8** — build tool and dev server
- **Tailwind CSS 3** — utility-first styling with `darkMode: 'class'`
- **React Router 7** — client-side routing with lazy-loaded routes
- **Axios 1.7** — HTTP client with a typed interceptor for error normalisation and a 10-second request timeout
- **Vitest** + **@testing-library/react** — unit and integration tests
- **ESLint** (TypeScript + React Hooks rules) + **Prettier** — code quality

No external state library (Context API is sufficient for this scale). No TanStack Query (the API is read-only with no cache invalidation requirements).

---

## Project Structure

```
src/
├── api/
│   └── client.ts             # Axios instance + ApiError class + response interceptor
├── components/
│   ├── Avatar.tsx             # Deterministic-colour initials avatar
│   ├── EmptyState.tsx         # No-results / no-favorites UI
│   ├── ErrorState.tsx         # API error with retry button
│   ├── Footer.tsx             # Page footer
│   ├── Header.tsx             # Sticky header with dark mode toggle + favorites count
│   ├── IconText.tsx           # Reusable icon + text row (used in UserCard)
│   ├── Pagination.tsx         # Page controls with ellipsis and aria-current
│   ├── SkeletonGrid.tsx       # Animated loading placeholder grid
│   ├── Toolbar.tsx            # Search, sort controls, city/company filters, CSV export
│   ├── UserCard.tsx           # Linked user summary card with search highlight
│   └── UserTable.tsx          # Sortable table view with search highlight
├── context/
│   ├── FavoritesContext.tsx   # Favorites set (ReadonlySet<number>), persisted to localStorage
│   └── ThemeContext.tsx       # Light/dark theme, reads prefers-color-scheme, persisted
├── hooks/
│   ├── useDebounce.ts         # Generic debounce hook
│   ├── usePagination.ts       # Generic pagination over any T[], auto-resets on list change
│   ├── useUserFilters.ts      # Filter + sort + favorites-only state with memoised derived values
│   ├── useUsers.ts            # useUsers() and useUser(id) — loading/error/data + retry
│   └── useViewMode.ts         # Card/table toggle, persisted to localStorage
├── pages/
│   ├── Home.tsx               # Directory listing — thin composition of hooks + components
│   └── UserDetail.tsx         # Single user profile page (lazy-loaded)
├── routes/
│   └── AppRoutes.tsx          # Route definitions, lazy UserDetail, catch-all redirect
├── services/
│   └── userService.ts         # Typed API calls: getAll() and getById(id)
├── tests/
│   ├── setup.ts               # @testing-library/jest-dom matchers
│   ├── Avatar.test.tsx        # Unit: getInitials, getAvatarColour, component render
│   ├── exportCsv.test.ts      # Unit: CSV content, escaping, filename, URL lifecycle
│   ├── filterUsers.test.ts    # Unit: filterAndSort (search/city/company/sort), getUnique
│   ├── Home.test.tsx          # Integration: skeleton, cards, error, search, empty state, table view
│   ├── Pagination.test.tsx    # Component: disabled states, prev/next callbacks, aria-current
│   ├── SearchInput.test.tsx   # Component (Toolbar): debounce, clear, dropdowns, view toggle
│   ├── url.test.ts            # Unit: ensureHttps edge cases
│   ├── UserCard.test.tsx      # Component: render, link target, favorite toggle, highlight
│   ├── UserDetail.test.tsx    # Integration: skeleton, data render, error, favorite toggle
│   ├── UserTable.test.tsx     # Component: table render, sort click, favorite toggle, empty
│   └── useUsers.test.tsx      # Hook: loading state, success, HTTP error, network error, retry
├── types/
│   └── index.ts               # User, Address, Geo, Company, ApiResponse<T>
└── utils/
    ├── cn.ts                  # Lightweight className joiner (no clsx dependency)
    ├── exportCsv.ts           # Serialize User[] to a .csv Blob download
    ├── filterUsers.ts         # filterAndSort, getUnique, FilterState, DEFAULT_FILTERS
    └── url.ts                 # ensureHttps — normalises JSONPlaceholder's protocol-less URLs
```

---

## Architecture

### Data Flow

```
JSONPlaceholder API
      │
  Axios instance        ← api/client.ts — 10s timeout, response interceptor → ApiError
      │
  UserService           ← services/userService.ts — typed getAll() / getById(id)
      │
  useUsers / useUser    ← hooks/useUsers.ts — { data, loading, error, retry }
      │
  useUserFilters        ← hooks/useUserFilters.ts — filter, sort, favorites-only, memoised
      │
  usePagination         ← hooks/usePagination.ts — page slice of filtered list, auto-reset
      │
  Home / UserDetail     ← pages — compose hooks, render components
```

### Key Design Decisions

**Axios over fetch** — Axios was chosen for three reasons: (1) the interceptor pattern allows centralised, typed error normalisation into a custom `ApiError` class with an HTTP status code; (2) `timeout: 10_000` prevents requests hanging indefinitely, which would require manual `AbortController` with fetch; (3) automatic JSON parsing and typed `axios.get<T>()` reduces boilerplate in `UserService`.

**`useUserFilters` hook** — all filter/sort/favorites-only logic is extracted from `Home` into a single hook. `Home` becomes a thin composition layer with no filtering logic of its own, making each piece testable in isolation.

**`usePagination<T>`** — generic over any array type. Automatically resets to page 1 via a `useEffect` that watches the `items` reference — so any filter or sort change (which produces a new array reference via `useMemo`) triggers a page reset without the caller needing to manage it.

**`useTheme`** — reads `prefers-color-scheme` as the initial value so first-time visitors get the right theme. Manual overrides are persisted to `localStorage`. Applies the `dark` class to `<html>` so all Tailwind `dark:` variants activate.

**`ApiError` class** — a custom `Error` subclass with a `status: number` field. The Axios interceptor normalises all HTTP and network failures into this type, so `useUsers` always receives a typed error regardless of failure mode.

**`Avatar`** — deterministic colour derived from `id % palette.length`, so the same user always renders the same colour across pages and re-renders. The palette cycles through 8 Tailwind colour families.

**`React.memo` everywhere** — every presentational component is wrapped in `React.memo`. When the user types in the search box, only components whose props actually changed re-render. Particularly important for `UserCard` since up to 5 instances are in the grid simultaneously.

**Code splitting** — `UserDetail` is loaded via `React.lazy` so the home page bundle never includes it. The `Suspense` fallback is a full-page spinner matching the app's design language.

---

## API

All data from [JSONPlaceholder](https://jsonplaceholder.typicode.com) — a free, read-only REST API.

| Endpoint | Used by |
|---|---|
| `GET /users` | `UserService.getAll()` → `useUsers()` |
| `GET /users/:id` | `UserService.getById(id)` → `useUser(id)` |

---

## Testing

```bash
npm test             # single run (CI)
npm run test:watch   # interactive watch mode
```

**44 tests across 11 files:**

| File | What it covers |
|---|---|
| `filterUsers.test.ts` | `filterAndSort` (search / city / company / asc / desc), `getUnique` |
| `url.test.ts` | `ensureHttps` — bare domain, existing https, existing http, subdomain+path |
| `exportCsv.test.ts` | Download trigger, URL revocation, header row, comma/quote escaping |
| `Avatar.test.tsx` | `getInitials`, `getAvatarColour`, component render, size classes |
| `UserCard.test.tsx` | Render, link target, favorite aria-label, toggle callback, highlight, phone |
| `UserTable.test.tsx` | Table render, sort click, favorite toggle, empty returns null, highlight |
| `Pagination.test.tsx` | Disabled states, prev/next callbacks, `aria-current`, hidden at 1 page |
| `SearchInput.test.tsx` | Debounce, clear button, city/company dropdowns, view mode toggle |
| `useUsers.test.tsx` | Loading state, API success, HTTP error, network error, retry function |
| `Home.test.tsx` | Skeleton, card render, error + retry, header, search filter, empty state, table toggle |
| `UserDetail.test.tsx` | Skeleton, data render, error + retry, favorites toggle, back link |

API calls are mocked with `vi.mock('../services/userService')` — no network requests during tests.

---

## Performance Optimisations

| Optimisation | Where | Effect |
|---|---|---|
| Debounced search (350ms) | `Toolbar` + `useDebounce` | Prevents `filterAndSort` running on every keystroke |
| `useMemo` for filtered list | `useUserFilters` | Only re-filters when users, filters, or favorites change |
| `useMemo` for city/company lists | `useUserFilters` | Dropdown options only recomputed when the user list changes |
| `useMemo` for page items | `usePagination` | Page slice only recomputed when page number or source list changes |
| `React.memo` on all components | All presentational components | Skips re-renders when props are shallowly equal |
| `useCallback` on all handlers | Hooks and pages | Stable references prevent unnecessary memo busts |
| `React.lazy` + `Suspense` | `UserDetail` route | Detail page bundle excluded from initial load |
| Cancellation flag in `useEffect` | `useUsers` | Prevents setState on unmounted components after navigation |

---

## Responsive Breakpoints

| Breakpoint | Card columns | Toolbar behaviour |
|---|---|---|
| `< 640px` (mobile) | 1 | Stacks vertically, short labels hidden |
| `640px+` (sm) | 2 | Row layout, labels visible |
| `1024px+` (lg) | 3 | — |
| `1280px+` (xl) | 4 | — |

The header and search bar are sticky on all breakpoints so navigation is always reachable on mobile.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `localhost:5173` |
| `npm run build` | TypeScript check + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run all 44 tests once |
| `npm run test:watch` | Vitest in interactive watch mode |
| `npm run lint` | ESLint on all `.ts` / `.tsx` files |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write over `src/` |
| `npm run format:check` | Prettier check (useful in CI) |

---

## Assumptions

- **Read-only data** — JSONPlaceholder is a mock API; no create/update/delete features are implemented.
- **Client-side only** — all filtering, sorting, and pagination happens in the browser. With a real paginated API these would be query parameters.
- **10 users** — the API always returns exactly 10 users. Pagination, filters, and the skeleton grid are built to handle any count gracefully.
- **No authentication** — the API is public; no login flow is needed.
- **localStorage availability** — favorites, theme, and view mode are persisted to `localStorage`. All reads/writes are wrapped in `try/catch` to handle environments where storage is blocked.

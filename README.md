# User Directory

A production-ready React application for browsing, searching, and filtering users from the [JSONPlaceholder](https://jsonplaceholder.typicode.com) API.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm test           # run all tests once
npm run test:watch # watch mode
```

---

## Features

| Feature | Details |
|---|---|
| **Search** | Debounced (350ms) across name, username, email |
| **Filter** | By city, company, favorites |
| **Sort** | Name / Username / Email, ascending or descending |
| **Pagination** | 5 users per page, smart ellipsis page buttons |
| **Favorites** | Toggle per card; persisted to `localStorage` |
| **Dark Mode** | System default + manual toggle; persisted to `localStorage` |
| **CSV Export** | Downloads the current filtered list |
| **User Detail** | Full profile page with contact, company, address, and map link |
| **Loading Skeletons** | Animated placeholder grid while fetching |
| **Error State** | Friendly error UI with a retry button |
| **Empty State** | Contextual messaging for no results vs no favorites |
| **Responsive** | Mobile → tablet → desktop (1–4 column grid) |
| **Code Split** | `UserDetail` is lazy-loaded via `React.lazy` |

---

## Tech Stack

- **React 19** + **TypeScript 6** (strict mode)
- **Vite 8** — build tool & dev server
- **Tailwind CSS 3** — utility-first styling with `darkMode: 'class'`
- **React Router 7** — client-side routing
- **Vitest** + **@testing-library/react** — unit & integration tests
- No Axios (native `fetch`). No external state library.

---

## Project Structure

```
src/
├── api/
│   └── client.ts           # apiFetch<T> wrapper + ApiError class
├── components/
│   ├── Avatar.tsx           # Reusable deterministic-colour avatar
│   ├── EmptyState.tsx       # No-results / no-favorites UI
│   ├── ErrorState.tsx       # API error with retry button
│   ├── Footer.tsx           # Page footer
│   ├── Header.tsx           # Sticky header with dark mode toggle
│   ├── IconText.tsx         # Reusable icon + text row
│   ├── Pagination.tsx       # Page controls with ellipsis
│   ├── SkeletonGrid.tsx     # Loading placeholder grid
│   ├── Toolbar.tsx          # Search, sort, filter, CSV export
│   └── UserCard.tsx         # Linked user summary card
├── hooks/
│   ├── useDebounce.ts       # Generic debounce hook
│   ├── useFavorites.ts      # Favorites set, persisted to localStorage
│   ├── usePagination.ts     # Generic pagination over any T[]
│   ├── useTheme.ts          # Dark/light theme, persisted to localStorage
│   ├── useUserFilters.ts    # Filter + sort + favorites-only state
│   └── useUsers.ts          # useUsers() and useUser(id) with retry
├── pages/
│   ├── Home.tsx             # Directory listing page
│   └── UserDetail.tsx       # Single user profile page
├── routes/
│   └── AppRoutes.tsx        # Route definitions + lazy UserDetail
├── services/
│   └── userService.ts       # Typed API calls via apiFetch
├── tests/
│   ├── setup.ts             # @testing-library/jest-dom matchers
│   ├── filterUsers.test.ts  # Utility: filterAndSort, getUnique
│   ├── Home.test.tsx        # Page: loading, error, search, empty state
│   ├── Pagination.test.tsx  # Component: prev/next, disabled, aria
│   ├── SearchInput.test.tsx # Toolbar: debounce, clear, dropdowns
│   ├── UserCard.test.tsx    # Component: render, favorite, highlight
│   └── useUsers.test.tsx    # Hook: API success, failure, retry
├── types/
│   └── index.ts             # User, Address, Company, Geo, ApiResponse
└── utils/
    ├── cn.ts                # Lightweight className joiner
    ├── exportCsv.ts         # Export User[] to a .csv download
    └── filterUsers.ts       # filterAndSort, getUnique, FilterState
```

---

## Architecture

### Data Flow

```
JSONPlaceholder API
      │
  apiFetch<T>          ← api/client.ts — fetch wrapper, throws ApiError
      │
  UserService          ← services/userService.ts — typed endpoint calls
      │
  useUsers / useUser   ← hooks/useUsers.ts — loading/error/data + retry
      │
  useUserFilters       ← hooks/useUserFilters.ts — filter, sort, favorites-only
      │
  usePagination        ← hooks/usePagination.ts — page slice of filtered list
      │
  Home / UserDetail    ← pages — compose hooks, render components
```

### Key Design Decisions

**Custom `apiFetch<T>`** instead of Axios — keeps the bundle small. Throws a typed `ApiError` with the HTTP status so components can distinguish network vs API errors.

**`useUserFilters` hook** — all filter/sort/favorites-only logic is extracted from `Home` into a single reusable hook. `Home` becomes a thin composition layer.

**`usePagination<T>`** — generic over any array type, resets to page 1 automatically whenever the source list reference changes (after any filter/sort).

**`useTheme`** — reads `prefers-color-scheme` as the initial value, then persists the user's choice to `localStorage`. Applies `dark` on `<html>` so all Tailwind `dark:` variants activate.

**`Avatar`** — deterministic colour derived from `id % palette.length`, so the same user always gets the same colour across pages and re-renders.

**`memo` everywhere** — every presentational component is wrapped in `React.memo` to prevent unnecessary re-renders when parent state changes.

**Code splitting** — `UserDetail` is loaded via `React.lazy` so first-page users never download the detail page bundle.

---

## API

All data comes from [JSONPlaceholder](https://jsonplaceholder.typicode.com).

| Endpoint | Used by |
|---|---|
| `GET /users` | `useUsers` — full user list |
| `GET /users/:id` | `useUser(id)` — single user detail |

---

## Testing

```bash
npm test             # single run
npm run test:watch   # interactive watch
```

**44 tests across 6 files:**

| File | What it tests |
|---|---|
| `filterUsers.test.ts` | `filterAndSort` (search/city/company/sort), `getUnique` |
| `UserCard.test.tsx` | Render, link target, favorite toggle, search highlight |
| `Pagination.test.tsx` | Disabled states, prev/next callbacks, `aria-current` |
| `SearchInput.test.tsx` | Debounce, clear button, dropdown onChange |
| `useUsers.test.tsx` | Loading state, API success, HTTP error, network error, retry |
| `Home.test.tsx` | Skeleton, card render, error state, header, search filter, empty state |

API calls are mocked with `vi.stubGlobal('fetch', vi.fn())` — no network required.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all tests once |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

---

## Responsive Breakpoints

| Breakpoint | Card columns | Layout changes |
|---|---|---|
| `< 640px` (mobile) | 1 | Toolbar stacks vertically, toolbar labels hidden, px-4 padding |
| `640px+` (sm) | 2 | Toolbar row layout, sm: labels visible |
| `1024px+` (lg) | 3 | — |
| `1280px+` (xl) | 4 | — |

The header is sticky (`position: sticky; top: 0`) on all breakpoints so search/navigation is always reachable on mobile.

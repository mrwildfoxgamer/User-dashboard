import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager-load Home (above the fold)
import Home from '../pages/Home';

// Lazy-load UserDetail — code-split, only downloaded on first visit
const UserDetail = lazy(() => import('../pages/UserDetail'));

export const PATHS = {
  HOME: '/',
  USER_DETAIL: '/users/:id',
} as const;

function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Home />} />
      <Route
        path={PATHS.USER_DETAIL}
        element={
          <Suspense fallback={<PageSpinner />}>
            <UserDetail />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  );
}

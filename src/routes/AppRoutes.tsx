import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';

const UserDetail = lazy(() => import('../pages/UserDetail'));

export const PATHS = {
  HOME: '/',
  USER_DETAIL: '/users/:id',
} as const;

function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
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

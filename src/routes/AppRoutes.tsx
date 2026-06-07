import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import UserDetail from '../pages/UserDetail';

export const PATHS = {
  HOME: '/',
  USER_DETAIL: '/users/:id',
} as const;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Home />} />
      <Route path={PATHS.USER_DETAIL} element={<UserDetail />} />
      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  );
}

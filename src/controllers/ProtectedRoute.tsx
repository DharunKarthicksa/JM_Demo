/**
 * controllers/ProtectedRoute.tsx
 * -----------------------------------------------------------------------------
 * Route guard. Redirects unauthenticated users to /login, preserving the
 * attempted location so they can be returned after sign-in. Wraps the entire
 * authenticated dashboard area in routes.tsx.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ROUTES } from '../config/constants';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

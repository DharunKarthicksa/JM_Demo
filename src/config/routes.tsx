/**
 * config/routes.tsx
 * -----------------------------------------------------------------------------
 * Central route table. Public /login plus a ProtectedRoute-guarded area that
 * renders inside the shared Layout (Sidebar + Header). This file is the
 * authoritative map of route -> page component for the analysis tool.
 *
 * Navigation flow:
 *   Executive Dashboard -> Plant Performance -> Asset Health
 *   Supply Chain & Sustainability reachable from the sidebar.
 */

import { Navigate, type RouteObject } from 'react-router-dom';
import { ROUTES } from './constants';

import Layout from '../components/Layout';
import ProtectedRoute from '../pages/auth/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';

import ExecutiveDashboard from '../pages/dashboard/ExecutiveDashboard';
import PlantPerformanceDashboard from '../pages/dashboard/PlantPerformanceDashboard';
import AssetHealthDashboard from '../pages/dashboard/AssetHealthDashboard';
import SupplyChainDashboard from '../pages/dashboard/SupplyChainDashboard';
import SustainabilityDashboard from '../pages/dashboard/SustainabilityDashboard';

export const routes: RouteObject[] = [
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    element: <ProtectedRoute />, // auth guard
    children: [
      {
        element: <Layout />, // shared shell
        children: [
          { path: ROUTES.EXECUTIVE, element: <ExecutiveDashboard /> },
          { path: ROUTES.PLANTS, element: <PlantPerformanceDashboard /> },
          { path: ROUTES.ASSETS, element: <AssetHealthDashboard /> },
          { path: ROUTES.SUPPLY_CHAIN, element: <SupplyChainDashboard /> },
          { path: ROUTES.SUSTAINABILITY, element: <SustainabilityDashboard /> },
        ],
      },
    ],
  },
  // Defaults
  { path: '/', element: <Navigate to={ROUTES.EXECUTIVE} replace /> },
  { path: '*', element: <Navigate to={ROUTES.EXECUTIVE} replace /> },
];

export default routes;

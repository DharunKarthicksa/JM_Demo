# JM Insights Portal — Source Map (MVC layout)

React + TypeScript + Vite SPA for Johns Manville, organized as Model–View–Controller.
Runs with no backend (mock adapter in `models/apiService.ts`). See ARCHITECTURE.md
for the full MVC breakdown and diagram.

## Install this drop
1. Replace your project's `src/` with the `src/` from this archive.
2. (Optional) copy `.env.example` to `.env`.
3. `npm run dev` -> open the localhost URL -> sign in (any credentials).

## Page -> API map (View -> Controller hook -> Model endpoint)

| View (page) | Route | Controller hook | API endpoint(s) |
|------|-------|-----------------|-----------------|
| ExecutiveDashboard | /dashboard/executive | useExecutiveData | GET /executive/kpis, /plants/utilization, /safety/incidents, /geo/manufacturing-sites |
| PlantPerformanceDashboard | /dashboard/plants | usePlantData | GET /plants, /plants/{id}/production, /downtime, /oee |
| AssetHealthDashboard | /dashboard/assets | useAssetData | GET /assets, /assets/{id}/health, /maintenance; POST /assets/predict-failure |
| SupplyChainDashboard | /dashboard/supplychain | useSupplyChainData | GET /inventory, /suppliers/performance, /shipments; POST /shipments/expedite |
| SustainabilityDashboard | /dashboard/sustainability | useSustainabilityData | GET /esg/energy, /emissions, /water, /score |
| LoginPage | /login | (AuthContext) | POST /auth/login |

## Cross-page flow (shared state via controllers/context)
Executive -> sets selectedPlantId -> Plant Performance -> Asset Health.
Sustainability also scoped by selectedPlantId. Supply Chain & Sustainability
also reachable from the Sidebar.

## Layers
- MODEL  src/models      apiService, authService, cacheService, mockData, types
- VIEW   src/views       components/*, pages/*
- CONTROL src/controllers hooks/*, context/*, routes.tsx, ProtectedRoute.tsx
- config src/config      environment, constants, theme
- utils  src/utils       retry, logger

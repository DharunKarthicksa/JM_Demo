# JM Insights Portal — Source Map

Enterprise manufacturing analytics SPA for **Johns Manville**.
Stack: React + TypeScript + Vite, Material UI, React Router, Axios, Context API.

Runs with **no backend**: an in-memory mock adapter inside `apiService.ts` serves
all `/api/...` calls instantly (toggle with `VITE_USE_MOCK_API`).

## How to use this drop
1. Replace your project's `src/` folder with the `src/` from this archive.
2. (Optional) copy `.env.example` to `.env` to override defaults.
3. `npm run dev` → open the printed localhost URL → sign in (any credentials).

---

## Page → API map

| Page | Route | APIs called |
|------|-------|-------------|
| Executive Dashboard | `/dashboard/executive` | GET `/executive/kpis`, GET `/plants/utilization`, GET `/safety/incidents`, GET `/geo/manufacturing-sites` |
| Plant Performance | `/dashboard/plants` | GET `/plants`, GET `/plants/{id}/production`, GET `/plants/{id}/downtime`, GET `/plants/{id}/oee` |
| Asset Health | `/dashboard/assets` | GET `/assets`, GET `/assets/{id}/health`, GET `/assets/{id}/maintenance`, POST `/assets/predict-failure` |
| Supply Chain | `/dashboard/supplychain` | GET `/inventory`, GET `/suppliers/performance`, GET `/shipments`, POST `/shipments/expedite` |
| Sustainability | `/dashboard/sustainability` | GET `/esg/energy`, GET `/esg/emissions`, GET `/esg/water`, GET `/esg/score` |
| Login | `/login` | POST `/auth/login` |

## Cross-page navigation / data flow
- **Executive → Plant Performance**: clicking a plant sets `selectedPlantId` in
  `plantContext`, then routes to `/dashboard/plants`.
- **Plant Performance → Asset Health**: "View Asset Health" routes to
  `/dashboard/assets`; assets are filtered by the same `selectedPlantId`.
- **Plant Performance → Sustainability**: ESG series are scoped by the shared
  `selectedPlantId`.
- Supply Chain & Sustainability are also reachable directly from the Sidebar.

## Shared services (used across pages)
- `services/apiService.ts` — single Axios client; request/response interceptors,
  JWT injection, retry w/ backoff, GET caching, mock adapter. **Every** call.
- `services/authService.ts` — JWT login/logout/token handling. Used by AuthContext
  and Asset Health.
- `services/cacheService.ts` — TTL cache backing cached GETs (Executive, etc.).
- `context/plantContext.tsx` — shared selected plant + global filters.
- `context/AuthContext.tsx` — shared auth state; gates ProtectedRoute.

## Reusable components
`Sidebar`, `Header`, `Layout`, `GlobalFilters`, `KPIWidget`, `ChartContainer`,
`LoadingSpinner`.

## Reusable hooks (page → hook → endpoint)
`useApi` (generic) and the per-domain hooks `useExecutiveData`, `usePlantData`,
`useAssetData`, `useSupplyChainData`, `useSustainabilityData`.

## Folder structure
```
src/
  components/   Sidebar, Header, Layout, GlobalFilters, KPIWidget, ChartContainer, LoadingSpinner
  pages/
    auth/       LoginPage, ProtectedRoute
    dashboard/  Executive, PlantPerformance, AssetHealth, SupplyChain, Sustainability
  services/     apiService, authService, cacheService, mockData
  context/      AuthContext, plantContext
  hooks/        useApi, useExecutiveData, usePlantData, useAssetData, useSupplyChainData, useSustainabilityData
  config/       constants, environment, theme, routes
  types/        index (domain model)
  utils/        retry, logger
  App.tsx, main.tsx
```

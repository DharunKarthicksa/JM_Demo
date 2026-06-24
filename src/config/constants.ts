/**
 * constants.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for every API endpoint the portal talks to, plus
 * application-wide constants and the route path registry.
 *
 * Keeping all endpoints here makes the page -> API mapping explicit and easy to
 * trace: each page/hook references API_ENDPOINTS.<domain>.<operation> rather
 * than hard-coding URL strings, so a static analysis tool can follow the graph
 * from component -> hook -> endpoint constant.
 */

/** Application metadata. */
export const APP = {
  NAME: 'JM Insights Portal',
  CLIENT: 'Johns Manville',
  VERSION: '1.0.0',
} as const;

/** localStorage / sessionStorage keys. */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jm_auth_token',
  AUTH_USER: 'jm_auth_user',
  ACTIVE_FILTERS: 'jm_active_filters',
} as const;

/**
 * API endpoint registry.
 *
 * Functions are used for parameterized routes so the parameter is part of the
 * call site (clear data lineage: which id flows into which endpoint).
 */
export const API_ENDPOINTS = {
  auth: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  executive: {
    KPIS: '/executive/kpis',
  },
  plants: {
    LIST: '/plants',
    UTILIZATION: '/plants/utilization',
    PRODUCTION: (plantId: string) => `/plants/${plantId}/production`,
    DOWNTIME: (plantId: string) => `/plants/${plantId}/downtime`,
    OEE: (plantId: string) => `/plants/${plantId}/oee`,
  },
  safety: {
    INCIDENTS: '/safety/incidents',
  },
  geo: {
    MANUFACTURING_SITES: '/geo/manufacturing-sites',
  },
  assets: {
    LIST: '/assets',
    HEALTH: (assetId: string) => `/assets/${assetId}/health`,
    MAINTENANCE: (assetId: string) => `/assets/${assetId}/maintenance`,
    PREDICT_FAILURE: '/assets/predict-failure',
  },
  supplyChain: {
    INVENTORY: '/inventory',
    SUPPLIER_PERFORMANCE: '/suppliers/performance',
    SHIPMENTS: '/shipments',
    EXPEDITE_SHIPMENT: '/shipments/expedite',
  },
  esg: {
    ENERGY: '/esg/energy',
    EMISSIONS: '/esg/emissions',
    WATER: '/esg/water',
    SCORE: '/esg/score',
  },
} as const;

/** Application route paths (kept in one place for cross-page navigation). */
export const ROUTES = {
  LOGIN: '/login',
  EXECUTIVE: '/dashboard/executive',
  PLANTS: '/dashboard/plants',
  ASSETS: '/dashboard/assets',
  SUPPLY_CHAIN: '/dashboard/supplychain',
  SUSTAINABILITY: '/dashboard/sustainability',
} as const;

/** Default global filter values shared across dashboards. */
export const DEFAULT_DATE_RANGE_DAYS = 30;

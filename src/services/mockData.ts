/**
 * services/mockData.ts
 * -----------------------------------------------------------------------------
 * Canned data + a resolver that maps an HTTP method + URL to a response. This
 * is what makes the demo run with no backend: the Axios mock interceptor in
 * apiService.ts calls resolveMock() and returns the data synchronously (no
 * artificial latency, so the UI feels instant).
 *
 * Endpoint matching mirrors API_ENDPOINTS so the page -> API mapping stays
 * truthful even in mock mode.
 */

import type {
  ExecutiveKpis,
  PlantUtilization,
  SafetyIncident,
  ManufacturingSite,
  Plant,
  ProductionPoint,
  DowntimePoint,
  OeeMetrics,
  Asset,
  AssetHealth,
  MaintenanceRecord,
  FailurePredictionResponse,
  InventoryItem,
  SupplierPerformance,
  Shipment,
  ExpediteShipmentResponse,
  EnergyUsage,
  Emissions,
  WaterConsumption,
  SustainabilityScore,
  LoginResponse,
} from '../types';

/* --------------------------- seed helpers ---------------------------------- */
const days = (n: number): string[] =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });

const PLANTS: Plant[] = [
  { id: 'P-DEN', name: 'Denver Fiberglass', region: 'North America', country: 'USA' },
  { id: 'P-WAT', name: 'Waterville Roofing', region: 'North America', country: 'USA' },
  { id: 'P-EDM', name: 'Edmonton Insulation', region: 'North America', country: 'Canada' },
  { id: 'P-TRZ', name: 'Trnava Plant', region: 'Europe', country: 'Slovakia' },
];

const ASSETS: Asset[] = [
  { id: 'A-1001', name: 'Furnace #1', plantId: 'P-DEN', type: 'Furnace', installedOn: '2018-04-12', status: 'healthy' },
  { id: 'A-1002', name: 'Spinner Line B', plantId: 'P-DEN', type: 'Spinner', installedOn: '2019-09-01', status: 'warning' },
  { id: 'A-2001', name: 'Coater #3', plantId: 'P-WAT', type: 'Coater', installedOn: '2017-02-20', status: 'critical' },
  { id: 'A-3001', name: 'Compressor A', plantId: 'P-EDM', type: 'Compressor', installedOn: '2020-11-05', status: 'healthy' },
];

/* --------------------------- canned payloads ------------------------------- */
const executiveKpis: ExecutiveKpis = {
  revenue: { valueUsd: 3_420_000_000, changePct: 4.2 },
  production: { tons: 1_280_000, changePct: 2.1 },
  plantUtilizationPct: 87.4,
  safetyIncidents: 3,
};

const plantUtilization: PlantUtilization[] = PLANTS.map((p, i) => ({
  plantId: p.id,
  plantName: p.name,
  utilizationPct: 78 + i * 4,
}));

const safetyIncidents: SafetyIncident[] = [
  { id: 'INC-1', plantId: 'P-WAT', date: days(10)[2], severity: 'high', description: 'Conveyor guard breach' },
  { id: 'INC-2', plantId: 'P-DEN', date: days(10)[5], severity: 'low', description: 'Minor slip, no injury' },
  { id: 'INC-3', plantId: 'P-TRZ', date: days(10)[8], severity: 'medium', description: 'Forklift near-miss' },
];

const manufacturingSites: ManufacturingSite[] = [
  { plantId: 'P-DEN', name: 'Denver Fiberglass', lat: 39.74, lng: -104.99, country: 'USA', status: 'operational' },
  { plantId: 'P-WAT', name: 'Waterville Roofing', lat: 44.55, lng: -69.63, country: 'USA', status: 'maintenance' },
  { plantId: 'P-EDM', name: 'Edmonton Insulation', lat: 53.55, lng: -113.49, country: 'Canada', status: 'operational' },
  { plantId: 'P-TRZ', name: 'Trnava Plant', lat: 48.37, lng: 17.59, country: 'Slovakia', status: 'operational' },
];

const productionFor = (plantId: string): ProductionPoint[] =>
  days(14).map((date, i) => ({ date, tons: 900 + ((i * 37 + plantId.length * 11) % 250) }));

const downtimeFor = (plantId: string): DowntimePoint[] =>
  days(14).map((date, i) => ({
    date,
    minutes: (i * 13 + plantId.length * 7) % 90,
    reason: i % 3 === 0 ? 'Changeover' : i % 3 === 1 ? 'Unplanned' : 'Maintenance',
  }));

const oeeFor = (plantId: string): OeeMetrics => ({
  plantId,
  availabilityPct: 91.2,
  performancePct: 88.5,
  qualityPct: 97.8,
  oeePct: 78.9,
});

const healthFor = (assetId: string): AssetHealth => ({
  assetId,
  healthScore: assetId === 'A-2001' ? 38 : assetId === 'A-1002' ? 64 : 92,
  vibration: 2.4,
  temperatureC: 71.3,
  lastReadingAt: new Date().toISOString(),
});

const maintenanceFor = (assetId: string): MaintenanceRecord[] => [
  { id: `${assetId}-M1`, assetId, date: days(60)[10], type: 'preventive', technician: 'R. Alvarez', notes: 'Lubrication + inspection' },
  { id: `${assetId}-M2`, assetId, date: days(60)[40], type: 'corrective', technician: 'S. Kim', notes: 'Replaced bearing' },
];

const inventory: InventoryItem[] = [
  { sku: 'RM-SILICA', material: 'Silica Sand', plantId: 'P-DEN', quantity: 1200, unit: 'tons', reorderLevel: 800, status: 'ok' },
  { sku: 'RM-SODA', material: 'Soda Ash', plantId: 'P-DEN', quantity: 420, unit: 'tons', reorderLevel: 500, status: 'low' },
  { sku: 'RM-ASPH', material: 'Asphalt', plantId: 'P-WAT', quantity: 90, unit: 'tons', reorderLevel: 300, status: 'critical' },
];

const suppliers: SupplierPerformance[] = [
  { supplierId: 'SUP-1', name: 'Rocky Mtn Minerals', onTimeDeliveryPct: 96.5, qualityScore: 92, openIssues: 1 },
  { supplierId: 'SUP-2', name: 'Continental Soda', onTimeDeliveryPct: 88.2, qualityScore: 85, openIssues: 4 },
];

const shipments: Shipment[] = [
  { id: 'SH-1', supplierId: 'SUP-1', material: 'Silica Sand', status: 'in_transit', eta: days(-3)[0] ?? '2026-07-01', expedited: false },
  { id: 'SH-2', supplierId: 'SUP-2', material: 'Soda Ash', status: 'delayed', eta: '2026-07-05', expedited: false },
];

const energyFor = (plantId: string): EnergyUsage => ({
  plantId,
  series: days(14).map((date, i) => ({ date, kwh: 50000 + ((i * 900) % 8000) })),
});
const emissionsFor = (plantId: string): Emissions => ({
  plantId,
  series: days(14).map((date, i) => ({ date, co2Tons: 120 + ((i * 7) % 40) })),
});
const waterFor = (plantId: string): WaterConsumption => ({
  plantId,
  series: days(14).map((date, i) => ({ date, cubicMeters: 800 + ((i * 23) % 200) })),
});
const sustainabilityScore: SustainabilityScore = {
  overall: 74,
  environmental: 71,
  social: 80,
  governance: 71,
};

/* --------------------------- resolver -------------------------------------- */
export interface MockMatch {
  data: unknown;
  status: number;
}

/** Build the prediction response from the posted body. */
function predictFailure(body: unknown): FailurePredictionResponse {
  const assetId = (body as { assetId?: string })?.assetId ?? 'A-0000';
  const prob = assetId === 'A-2001' ? 81 : assetId === 'A-1002' ? 44 : 9;
  return {
    assetId,
    failureProbabilityPct: prob,
    predictedFailureDate: prob > 50 ? '2026-07-12' : null,
    recommendedAction: prob > 50 ? 'Schedule corrective maintenance within 7 days' : 'Continue monitoring',
  };
}

const loginResponse: LoginResponse = {
  token: 'demo.jwt.token',
  expiresInSec: 3600,
  user: { id: 'U-1', name: 'Dana Executive', email: 'dana@jm.com', role: 'executive' },
};

/**
 * Resolve a mock response for a given method + path (path is WITHOUT the
 * apiBaseUrl prefix, e.g. "/plants/P-DEN/production").
 * Returns null when no rule matches so the caller can 404.
 */
export function resolveMock(method: string, path: string, body?: unknown): MockMatch | null {
  const m = method.toUpperCase();

  // Auth
  if (m === 'POST' && path === '/auth/login') return { data: loginResponse, status: 200 };
  if (m === 'POST' && path === '/auth/logout') return { data: { ok: true }, status: 200 };
  if (m === 'POST' && path === '/auth/refresh') return { data: { token: loginResponse.token, expiresInSec: 3600 }, status: 200 };

  // Executive
  if (m === 'GET' && path === '/executive/kpis') return { data: executiveKpis, status: 200 };
  if (m === 'GET' && path === '/plants/utilization') return { data: plantUtilization, status: 200 };
  if (m === 'GET' && path === '/safety/incidents') return { data: safetyIncidents, status: 200 };
  if (m === 'GET' && path === '/geo/manufacturing-sites') return { data: manufacturingSites, status: 200 };

  // Plants
  if (m === 'GET' && path === '/plants') return { data: PLANTS, status: 200 };
  let match = path.match(/^\/plants\/([^/]+)\/production$/);
  if (m === 'GET' && match) return { data: productionFor(match[1]), status: 200 };
  match = path.match(/^\/plants\/([^/]+)\/downtime$/);
  if (m === 'GET' && match) return { data: downtimeFor(match[1]), status: 200 };
  match = path.match(/^\/plants\/([^/]+)\/oee$/);
  if (m === 'GET' && match) return { data: oeeFor(match[1]), status: 200 };

  // Assets
  if (m === 'GET' && path === '/assets') return { data: ASSETS, status: 200 };
  match = path.match(/^\/assets\/([^/]+)\/health$/);
  if (m === 'GET' && match) return { data: healthFor(match[1]), status: 200 };
  match = path.match(/^\/assets\/([^/]+)\/maintenance$/);
  if (m === 'GET' && match) return { data: maintenanceFor(match[1]), status: 200 };
  if (m === 'POST' && path === '/assets/predict-failure') return { data: predictFailure(body), status: 200 };

  // Supply chain
  if (m === 'GET' && path === '/inventory') return { data: inventory, status: 200 };
  if (m === 'GET' && path === '/suppliers/performance') return { data: suppliers, status: 200 };
  if (m === 'GET' && path === '/shipments') return { data: shipments, status: 200 };
  if (m === 'POST' && path === '/shipments/expedite') {
    const id = (body as { shipmentId?: string })?.shipmentId ?? 'SH-0';
    const res: ExpediteShipmentResponse = { shipmentId: id, newEta: '2026-06-30', expedited: true };
    return { data: res, status: 200 };
  }

  // ESG
  if (m === 'GET' && path === '/esg/energy') return { data: energyFor('P-DEN'), status: 200 };
  if (m === 'GET' && path === '/esg/emissions') return { data: emissionsFor('P-DEN'), status: 200 };
  if (m === 'GET' && path === '/esg/water') return { data: waterFor('P-DEN'), status: 200 };
  if (m === 'GET' && path === '/esg/score') return { data: sustainabilityScore, status: 200 };

  return null;
}

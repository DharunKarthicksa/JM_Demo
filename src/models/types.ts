/**
 * models/types.ts
 * -----------------------------------------------------------------------------
 * Shared domain model for the JM Insights Portal. Every API response and
 * cross-component data structure is typed here so the data lineage (which shape
 * flows from which endpoint into which widget) is explicit.
 */

/* ----------------------------- Auth ---------------------------------------- */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'executive' | 'plant_manager' | 'analyst';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresInSec: number;
  user: AuthUser;
}

/* ----------------------------- Shared filters ------------------------------ */
export interface GlobalFilterState {
  /** ISO date strings. */
  dateFrom: string;
  dateTo: string;
  /** Optional region scope shared across dashboards. */
  region: string | 'all';
}

/* ----------------------------- Executive ----------------------------------- */
export interface ExecutiveKpis {
  revenue: { valueUsd: number; changePct: number };
  production: { tons: number; changePct: number };
  plantUtilizationPct: number;
  safetyIncidents: number;
}

export interface PlantUtilization {
  plantId: string;
  plantName: string;
  utilizationPct: number;
}

export interface SafetyIncident {
  id: string;
  plantId: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ManufacturingSite {
  plantId: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  status: 'operational' | 'maintenance' | 'offline';
}

/* ----------------------------- Plants -------------------------------------- */
export interface Plant {
  id: string;
  name: string;
  region: string;
  country: string;
}

export interface ProductionPoint {
  date: string;
  tons: number;
}

export interface DowntimePoint {
  date: string;
  minutes: number;
  reason: string;
}

export interface OeeMetrics {
  plantId: string;
  availabilityPct: number;
  performancePct: number;
  qualityPct: number;
  oeePct: number;
}

/* ----------------------------- Assets -------------------------------------- */
export interface Asset {
  id: string;
  name: string;
  plantId: string;
  type: string;
  installedOn: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface AssetHealth {
  assetId: string;
  healthScore: number; // 0-100
  vibration: number;
  temperatureC: number;
  lastReadingAt: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  date: string;
  type: 'preventive' | 'corrective';
  technician: string;
  notes: string;
}

export interface FailurePredictionRequest {
  assetId: string;
  horizonDays: number;
}

export interface FailurePredictionResponse {
  assetId: string;
  failureProbabilityPct: number;
  predictedFailureDate: string | null;
  recommendedAction: string;
}

/* ----------------------------- Supply Chain -------------------------------- */
export interface InventoryItem {
  sku: string;
  material: string;
  plantId: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: 'ok' | 'low' | 'critical';
}

export interface SupplierPerformance {
  supplierId: string;
  name: string;
  onTimeDeliveryPct: number;
  qualityScore: number;
  openIssues: number;
}

export interface Shipment {
  id: string;
  supplierId: string;
  material: string;
  status: 'in_transit' | 'delivered' | 'delayed';
  eta: string;
  expedited: boolean;
}

export interface ExpediteShipmentRequest {
  shipmentId: string;
}

export interface ExpediteShipmentResponse {
  shipmentId: string;
  newEta: string;
  expedited: boolean;
}

/* ----------------------------- Sustainability ------------------------------ */
export interface EnergyUsage {
  plantId: string;
  series: { date: string; kwh: number }[];
}

export interface Emissions {
  plantId: string;
  series: { date: string; co2Tons: number }[];
}

export interface WaterConsumption {
  plantId: string;
  series: { date: string; cubicMeters: number }[];
}

export interface SustainabilityScore {
  overall: number; // 0-100
  environmental: number;
  social: number;
  governance: number;
}

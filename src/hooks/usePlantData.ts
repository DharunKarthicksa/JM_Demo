/**
 * hooks/usePlantData.ts
 * -----------------------------------------------------------------------------
 * Data hooks for the Plant Performance Dashboard. Most are parameterized by the
 * selected plantId (which flows in from the shared plantContext, originally set
 * on the Executive Dashboard).
 *
 * API calls:
 *   GET /api/plants
 *   GET /api/plants/{plantId}/production
 *   GET /api/plants/{plantId}/downtime
 *   GET /api/plants/{plantId}/oee
 */

import api from '../services/apiService';
import { API_ENDPOINTS } from '../config/constants';
import { useApi } from './useApi';
import type { Plant, ProductionPoint, DowntimePoint, OeeMetrics } from '../types';

export function usePlants() {
  return useApi<Plant[]>(() => api.get<Plant[]>(API_ENDPOINTS.plants.LIST, undefined, true), []);
}

export function usePlantProduction(plantId: string | null) {
  return useApi<ProductionPoint[]>(
    () => api.get<ProductionPoint[]>(API_ENDPOINTS.plants.PRODUCTION(plantId as string)),
    [plantId],
    Boolean(plantId),
  );
}

export function usePlantDowntime(plantId: string | null) {
  return useApi<DowntimePoint[]>(
    () => api.get<DowntimePoint[]>(API_ENDPOINTS.plants.DOWNTIME(plantId as string)),
    [plantId],
    Boolean(plantId),
  );
}

export function usePlantOee(plantId: string | null) {
  return useApi<OeeMetrics>(
    () => api.get<OeeMetrics>(API_ENDPOINTS.plants.OEE(plantId as string)),
    [plantId],
    Boolean(plantId),
  );
}

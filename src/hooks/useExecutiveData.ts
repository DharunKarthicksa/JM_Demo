/**
 * hooks/useExecutiveData.ts
 * -----------------------------------------------------------------------------
 * Data hook for the Executive Dashboard.
 *
 * API calls (all GET, cached):
 *   GET /api/executive/kpis
 *   GET /api/plants/utilization
 *   GET /api/safety/incidents
 *   GET /api/geo/manufacturing-sites
 */

import api from '../services/apiService';
import { API_ENDPOINTS } from '../config/constants';
import { useApi } from './useApi';
import type {
  ExecutiveKpis,
  PlantUtilization,
  SafetyIncident,
  ManufacturingSite,
} from '../types';

export function useExecutiveKpis() {
  return useApi<ExecutiveKpis>(
    () => api.get<ExecutiveKpis>(API_ENDPOINTS.executive.KPIS, undefined, /* cache */ true),
    [],
  );
}

export function usePlantUtilization() {
  return useApi<PlantUtilization[]>(
    () => api.get<PlantUtilization[]>(API_ENDPOINTS.plants.UTILIZATION, undefined, true),
    [],
  );
}

export function useSafetyIncidents() {
  return useApi<SafetyIncident[]>(
    () => api.get<SafetyIncident[]>(API_ENDPOINTS.safety.INCIDENTS, undefined, true),
    [],
  );
}

export function useManufacturingSites() {
  return useApi<ManufacturingSite[]>(
    () => api.get<ManufacturingSite[]>(API_ENDPOINTS.geo.MANUFACTURING_SITES, undefined, true),
    [],
  );
}

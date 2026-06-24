/**
 * controllers/hooks/useSustainabilityData.ts
 * -----------------------------------------------------------------------------
 * Data hooks for the Sustainability Dashboard. Uses the selected plant from the
 * shared plantContext (data carried over from Plant Performance) and the shared
 * date filters.
 *
 * API calls:
 *   GET /api/esg/energy
 *   GET /api/esg/emissions
 *   GET /api/esg/water
 *   GET /api/esg/score
 */

import api from '../../models/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { useApi } from './useApi';
import type {
  EnergyUsage,
  Emissions,
  WaterConsumption,
  SustainabilityScore,
} from '../../models/types';

export function useEnergyUsage(plantId: string | null) {
  return useApi<EnergyUsage>(
    () => api.get<EnergyUsage>(API_ENDPOINTS.esg.ENERGY, { params: { plantId } }),
    [plantId],
  );
}

export function useEmissions(plantId: string | null) {
  return useApi<Emissions>(
    () => api.get<Emissions>(API_ENDPOINTS.esg.EMISSIONS, { params: { plantId } }),
    [plantId],
  );
}

export function useWaterConsumption(plantId: string | null) {
  return useApi<WaterConsumption>(
    () => api.get<WaterConsumption>(API_ENDPOINTS.esg.WATER, { params: { plantId } }),
    [plantId],
  );
}

export function useSustainabilityScore() {
  return useApi<SustainabilityScore>(
    () => api.get<SustainabilityScore>(API_ENDPOINTS.esg.SCORE, undefined, true),
    [],
  );
}

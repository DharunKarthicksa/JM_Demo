/**
 * controllers/hooks/useAssetData.ts
 * -----------------------------------------------------------------------------
 * Data hooks for the Asset Health Dashboard.
 *
 * API calls:
 *   GET  /api/assets
 *   GET  /api/assets/{assetId}/health
 *   GET  /api/assets/{assetId}/maintenance
 *   POST /api/assets/predict-failure
 */

import { useCallback, useState } from 'react';
import api from '../../models/apiService';
import type { ApiError } from '../../models/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { useApi } from './useApi';
import type {
  Asset,
  AssetHealth,
  MaintenanceRecord,
  FailurePredictionRequest,
  FailurePredictionResponse,
} from '../../models/types';

export function useAssets(plantId: string | null) {
  // Asset list is filtered client-side by plant when one is selected.
  return useApi<Asset[]>(async () => {
    const all = await api.get<Asset[]>(API_ENDPOINTS.assets.LIST, undefined, true);
    return plantId ? all.filter((a) => a.plantId === plantId) : all;
  }, [plantId]);
}

export function useAssetHealth(assetId: string | null) {
  return useApi<AssetHealth>(
    () => api.get<AssetHealth>(API_ENDPOINTS.assets.HEALTH(assetId as string)),
    [assetId],
    Boolean(assetId),
  );
}

export function useAssetMaintenance(assetId: string | null) {
  return useApi<MaintenanceRecord[]>(
    () => api.get<MaintenanceRecord[]>(API_ENDPOINTS.assets.MAINTENANCE(assetId as string)),
    [assetId],
    Boolean(assetId),
  );
}

/**
 * Imperative hook for the failure-prediction POST. Returns a trigger function
 * plus loading/result/error state (mutations aren't auto-run like GETs).
 */
export function usePredictFailure() {
  const [result, setResult] = useState<FailurePredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const predict = useCallback(async (req: FailurePredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<FailurePredictionResponse>(
        API_ENDPOINTS.assets.PREDICT_FAILURE,
        req,
      );
      setResult(res);
      return res;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { predict, result, loading, error };
}

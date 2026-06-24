/**
 * hooks/useSupplyChainData.ts
 * -----------------------------------------------------------------------------
 * Data hooks for the Supply Chain Dashboard.
 *
 * API calls:
 *   GET  /api/inventory
 *   GET  /api/suppliers/performance
 *   GET  /api/shipments
 *   POST /api/shipments/expedite
 */

import { useCallback, useState } from 'react';
import api from '../services/apiService';
import type { ApiError } from '../services/apiService';
import { API_ENDPOINTS } from '../config/constants';
import { useApi } from './useApi';
import type {
  InventoryItem,
  SupplierPerformance,
  Shipment,
  ExpediteShipmentResponse,
} from '../types';

export function useInventory() {
  return useApi<InventoryItem[]>(
    () => api.get<InventoryItem[]>(API_ENDPOINTS.supplyChain.INVENTORY),
    [],
  );
}

export function useSupplierPerformance() {
  return useApi<SupplierPerformance[]>(
    () => api.get<SupplierPerformance[]>(API_ENDPOINTS.supplyChain.SUPPLIER_PERFORMANCE),
    [],
  );
}

export function useShipments() {
  return useApi<Shipment[]>(
    () => api.get<Shipment[]>(API_ENDPOINTS.supplyChain.SHIPMENTS),
    [],
  );
}

export function useExpediteShipment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const expedite = useCallback(async (shipmentId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await api.post<ExpediteShipmentResponse>(
        API_ENDPOINTS.supplyChain.EXPEDITE_SHIPMENT,
        { shipmentId },
      );
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { expedite, loading, error };
}

/**
 * context/plantContext.tsx
 * -----------------------------------------------------------------------------
 * Shared cross-page state:
 *   - selectedPlantId: set on the Executive Dashboard and consumed by Plant
 *     Performance, Asset Health, and Sustainability (data flows downstream).
 *   - globalFilters: the shared date range / region used by GlobalFilters and
 *     read by every dashboard.
 *
 * This context is the backbone of the cross-page data lineage the analysis tool
 * is meant to detect: Executive -> (selectedPlantId) -> Plant Performance ->
 * Asset Health, plus shared date filters consumed app-wide.
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { GlobalFilterState } from '../types';
import { DEFAULT_DATE_RANGE_DAYS } from '../config/constants';

function defaultFilters(): GlobalFilterState {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - DEFAULT_DATE_RANGE_DAYS);
  return {
    dateFrom: from.toISOString().slice(0, 10),
    dateTo: to.toISOString().slice(0, 10),
    region: 'all',
  };
}

interface PlantContextValue {
  selectedPlantId: string | null;
  setSelectedPlantId: (plantId: string | null) => void;
  globalFilters: GlobalFilterState;
  setGlobalFilters: (filters: Partial<GlobalFilterState>) => void;
  resetFilters: () => void;
}

const PlantContext = createContext<PlantContextValue | undefined>(undefined);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [globalFilters, setFilters] = useState<GlobalFilterState>(defaultFilters);

  const setGlobalFilters = useCallback((patch: Partial<GlobalFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters()), []);

  const value = useMemo<PlantContextValue>(
    () => ({ selectedPlantId, setSelectedPlantId, globalFilters, setGlobalFilters, resetFilters }),
    [selectedPlantId, globalFilters, setGlobalFilters, resetFilters],
  );

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
}

/** Hook for consuming the shared plant/filter state. */
export function usePlantContext(): PlantContextValue {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error('usePlantContext must be used within a PlantProvider');
  return ctx;
}

/**
 * hooks/useApi.ts
 * -----------------------------------------------------------------------------
 * Generic async-data hook used by every domain hook. Handles loading / error /
 * data state and re-runs when its dependency list changes. Centralizing this
 * keeps each domain hook tiny and consistent.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ApiError } from '../services/apiService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  /** Manually re-run the fetcher. */
  refetch: () => void;
}

/**
 * @param fetcher  function returning the promise to await
 * @param deps     dependency list — fetcher re-runs when these change
 * @param enabled  when false, the fetch is skipped (e.g. waiting for an id)
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  enabled = true,
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<ApiError | null>(null);
  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, nonce]);

  return { data, loading, error, refetch };
}

export default useApi;

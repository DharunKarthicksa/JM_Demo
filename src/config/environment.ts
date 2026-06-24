/**
 * environment.ts
 * -----------------------------------------------------------------------------
 * Centralized environment configuration for the JM Insights Portal.
 *
 * In a real enterprise deployment these values come from build-time env vars
 * (Vite exposes them on `import.meta.env`). For the demo we provide safe
 * defaults so the app runs with zero backend setup.
 *
 * USE_MOCK_API drives the in-memory mock interceptor in apiService.ts. When
 * true (the default for this demo) every `/api/...` call resolves instantly
 * with canned data — no backend, no network latency.
 */

interface AppEnvironment {
  /** Logical environment name. */
  readonly name: 'development' | 'staging' | 'production';
  /** Base URL all API requests are prefixed with. */
  readonly apiBaseUrl: string;
  /** When true, requests are served by the local mock layer. */
  readonly useMockApi: boolean;
  /** Default request timeout in milliseconds. */
  readonly requestTimeoutMs: number;
  /** Max automatic retries for idempotent (GET) requests. */
  readonly maxRetries: number;
  /** TTL applied to cached API responses, in milliseconds. */
  readonly cacheTtlMs: number;
}

const viteEnv = import.meta.env;

export const ENV: AppEnvironment = {
  name: (viteEnv?.VITE_APP_ENV as AppEnvironment['name']) ?? 'development',
  apiBaseUrl: viteEnv?.VITE_API_BASE_URL ?? '/api',
  // Default ON for the demo so the app runs without a backend.
  useMockApi: (viteEnv?.VITE_USE_MOCK_API ?? 'true') === 'true',
  requestTimeoutMs: Number(viteEnv?.VITE_REQUEST_TIMEOUT_MS ?? 15000),
  maxRetries: Number(viteEnv?.VITE_MAX_RETRIES ?? 2),
  cacheTtlMs: Number(viteEnv?.VITE_CACHE_TTL_MS ?? 60000),
};

export default ENV;

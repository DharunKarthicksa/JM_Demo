/**
 * models/apiService.ts
 * -----------------------------------------------------------------------------
 * The centralized API client. EVERY network call in the app goes through here.
 *
 * Responsibilities:
 *   - Single configured Axios instance (base URL, timeout).
 *   - Request interceptor: attaches the JWT bearer token.
 *   - Response interceptor: normalizes errors, handles 401 -> logout.
 *   - Retry logic for idempotent GETs (exponential backoff).
 *   - Optional GET response caching via cacheService.
 *   - A demo mock adapter so the app runs with no backend (instant responses).
 *
 * Pages never import Axios directly — they call the typed `api` methods, which
 * makes the page -> service -> endpoint chain easy to trace.
 */

import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ENV } from '../config/environment';
import { STORAGE_KEYS } from '../config/constants';
import { withRetry } from '../utils/retry';
import logger from '../utils/logger';
import cacheService from './cacheService';
import { resolveMock } from './mockData';

/** Normalized error surfaced to the UI layer. */
export interface ApiError {
  status: number;
  message: string;
  url?: string;
}

/* --------------------------- token accessors ------------------------------- */
function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/** Called on 401 to force re-authentication. Kept here to avoid a circular
 *  import with authService (which depends on this module). */
function forceLogout(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  cacheService.clear();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

/* --------------------------- axios instance -------------------------------- */
const client: AxiosInstance = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: ENV.requestTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

/* --------------------------- request interceptor --------------------------- */
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  logger.debug('->', config.method?.toUpperCase(), config.url);
  return config;
});

/* --------------------------- response interceptor -------------------------- */
client.interceptors.response.use(
  (response) => {
    logger.debug('<-', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    if (status === 401) {
      logger.warn('401 received — forcing logout');
      forceLogout();
    }
    const apiError: ApiError = {
      status,
      message:
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        'Unexpected error',
      url: error.config?.url,
    };
    return Promise.reject(apiError);
  },
);

/* --------------------------- mock adapter ---------------------------------- *
 * When ENV.useMockApi is true we short-circuit Axios with an adapter that
 * resolves canned data synchronously. Interceptors still run, so auth/error
 * behavior is identical to a real backend — just instant.
 */
if (ENV.useMockApi) {
  client.defaults.adapter = async (config) => {
    const path = (config.url ?? '').replace(/^.*\/api/, '') || config.url || '';
    const method = (config.method ?? 'get').toUpperCase();
    const body = config.data ? JSON.parse(config.data as string) : undefined;
    const match = resolveMock(method, path, body);

    if (!match) {
      logger.warn('mock 404', method, path);
      return Promise.reject({
        response: { status: 404, data: { message: `No mock for ${method} ${path}` }, config, headers: {}, statusText: 'Not Found' },
        config,
        isAxiosError: true,
        message: 'Not Found',
        name: 'AxiosError',
        toJSON: () => ({}),
      } as AxiosError);
    }

    return {
      data: match.data,
      status: match.status,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  };
  logger.info('Mock API enabled — running without a backend.');
}

/* --------------------------- retry predicate ------------------------------- */
const isRetryable = (error: unknown): boolean => {
  const status = (error as ApiError)?.status ?? 0;
  // Retry on network errors (status 0) and 5xx; never on 4xx.
  return status === 0 || (status >= 500 && status < 600);
};

/* --------------------------- public API ------------------------------------ */
export const api = {
  /**
   * GET with retry + optional caching.
   * @param url    endpoint path (relative to baseURL)
   * @param config axios config
   * @param cache  when true, memoize the response in cacheService
   */
  async get<T>(url: string, config?: AxiosRequestConfig, cache = false): Promise<T> {
    if (cache) {
      const cached = cacheService.get<T>(url);
      if (cached !== undefined) return cached;
    }
    const data = await withRetry<T>(
      async () => (await client.get<T>(url, config)).data,
      { retries: ENV.maxRetries, shouldRetry: isRetryable },
    );
    if (cache) cacheService.set<T>(url, data);
    return data;
  },

  /** POST (not retried by default — may be non-idempotent). */
  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await client.post<T>(url, body, config)).data;
  },

  /** PUT helper. */
  async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await client.put<T>(url, body, config)).data;
  },

  /** Expose the raw client for advanced cases. */
  raw: client,
};

export default api;

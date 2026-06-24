/**
 * services/authService.ts
 * -----------------------------------------------------------------------------
 * Shared authentication service. Owns the JWT lifecycle (login, logout, token
 * persistence, current-user lookup) and is consumed by AuthContext and the
 * Asset Health dashboard (which the brief notes uses the shared auth service).
 *
 * Uses the centralized apiService for the actual network calls — another
 * shared-service dependency for the analysis graph.
 */

import api from './apiService';
import cacheService from './cacheService';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';
import type { AuthUser, LoginRequest, LoginResponse } from '../types';
import logger from '../utils/logger';

/** Minimal JWT decode (payload only) — for demo display of token claims. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return { demo: true };
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const authService = {
  /** Authenticate and persist the JWT + user. */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const res = await api.post<LoginResponse>(API_ENDPOINTS.auth.LOGIN, credentials);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(res.user));
    logger.info('Logged in as', res.user.email);
    return res.user;
  },

  /** Clear session + caches. */
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.auth.LOGOUT);
    } catch (err) {
      logger.warn('logout endpoint failed (continuing local logout)', err);
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    cacheService.clear();
  },

  /** Current token, if any. */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /** Hydrate the persisted user. */
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },

  /** Whether a (non-empty) token exists. */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },

  /** Expose decoded claims for the demo header. */
  getTokenClaims(): Record<string, unknown> | null {
    const token = this.getToken();
    return token ? decodeJwtPayload(token) : null;
  },
};

export default authService;

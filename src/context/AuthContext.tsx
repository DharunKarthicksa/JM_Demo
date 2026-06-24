/**
 * context/AuthContext.tsx
 * -----------------------------------------------------------------------------
 * React Context wrapping authService so any component can read the current user
 * and trigger login/logout. ProtectedRoute and Header both consume this.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import authService from '../services/authService';
import type { AuthUser, LoginRequest } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user) && authService.isAuthenticated(),
      login: async (credentials) => {
        const u = await authService.login(credentials);
        setUser(u);
      },
      logout: async () => {
        await authService.logout();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook for consuming auth state. Throws if used outside the provider. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

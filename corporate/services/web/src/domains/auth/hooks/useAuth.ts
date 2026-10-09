import { useAuthStore } from '../auth.store';

// Atomic Selectors
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((state) => state.isAuthLoading);
export const useAuthStatus = () => useAuthStore((state) => state.status);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthErrorCode = () => useAuthStore((state) => state.errorCode);
export const useAuthActions = () => useAuthStore((state) => state.actions);

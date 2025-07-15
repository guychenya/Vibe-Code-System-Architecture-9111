import { create } from 'zustand';

// Legacy store for backward compatibility
export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  login: () => {
    // This is now handled by the auth service
    console.warn('useAuthStore.login() is deprecated. Use useAuth hook instead.');
  },
  logout: () => {
    // This is now handled by the auth service
    console.warn('useAuthStore.logout() is deprecated. Use useAuth hook instead.');
  },
  // Update state based on auth service
  updateFromAuth: (authState) => {
    set({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user
    });
  }
}));
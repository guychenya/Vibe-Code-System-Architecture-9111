import { create } from 'zustand';
import { useAuth } from '../hooks/useAuth';

// Legacy store for backward compatibility
export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  
  login: () => {
    // This is now handled by the OIDC auth system
    console.warn('useAuthStore.login() is deprecated. Use useAuth hook instead.');
  },
  
  logout: () => {
    // This is now handled by the OIDC auth system
    console.warn('useAuthStore.logout() is deprecated. Use useAuth hook instead.');
  },
  
  // Update state based on OIDC auth
  updateFromOIDC: (authState) => {
    set({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user
    });
  }
}));

// Hook to sync OIDC auth with legacy store
export const useAuthSync = () => {
  const auth = useAuth();
  const updateStore = useAuthStore(state => state.updateFromOIDC);
  
  React.useEffect(() => {
    updateStore(auth);
  }, [auth.isAuthenticated, auth.user, updateStore]);
  
  return auth;
};
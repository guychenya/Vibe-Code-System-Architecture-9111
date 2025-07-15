import { useState, useEffect } from 'react';
import authService from '../services/auth-service.js';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.addAuthListener((newUser) => {
      setUser(newUser);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const signIn = async (providerId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.signIn(providerId);
      authService.logSecurityEvent('sign_in_attempt', { provider: providerId });
    } catch (err) {
      setError(err.message);
      authService.logSecurityEvent('sign_in_failed', { 
        provider: providerId, 
        error: err.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      authService.logSecurityEvent('sign_out');
    } catch (err) {
      setError(err.message);
      authService.logSecurityEvent('sign_out_failed', { error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      return await authService.refreshToken();
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    error,
    signIn,
    signOut,
    refreshToken,
    hasPermission: authService.hasPermission.bind(authService),
    getAvailableProviders: authService.getAvailableProviders.bind(authService)
  };
};
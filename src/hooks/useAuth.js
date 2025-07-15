import { useState, useEffect } from 'react';
import authService from '../services/auth-service.js';
import supabase from '../lib/supabase.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing Supabase session first
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          
          if (supabaseUser) {
            setUser({
              id: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.user_metadata?.full_name || 
                    supabaseUser.user_metadata?.name || 
                    supabaseUser.email,
              avatar: supabaseUser.user_metadata?.avatar_url,
              provider: 'github',
              createdAt: supabaseUser.created_at
            });
          } else {
            // Fallback to authService
            setUser(authService.getCurrentUser());
          }
        } else {
          // Fallback to authService
          setUser(authService.getCurrentUser());
        }
      } catch (err) {
        console.error("Auth session error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth state changes from authService
    const unsubscribe = authService.addAuthListener((newUser) => {
      setUser(newUser);
      setError(null);
      setIsLoading(false);
    });
    
    // Subscribe to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || 
                  supabaseUser.user_metadata?.name || 
                  supabaseUser.email,
            avatar: supabaseUser.user_metadata?.avatar_url,
            provider: 'github',
            createdAt: supabaseUser.created_at
          });
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (providerId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (providerId === 'github') {
        // Use Supabase auth for GitHub
        await authService.signIn(providerId);
      } else {
        // Use OIDC client for other providers
        await authService.signIn(providerId);
      }
      
      authService.logSecurityEvent('sign_in_attempt', { provider: providerId });
    } catch (err) {
      setError(err.message);
      authService.logSecurityEvent('sign_in_failed', { provider: providerId, error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Also sign out from authService
      await authService.signOut();
      
      setUser(null);
      authService.logSecurityEvent('sign_out');
    } catch (err) {
      setError(err.message);
      authService.logSecurityEvent('sign_out_failed', { error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn,
    signOut,
    hasPermission: authService.hasPermission.bind(authService),
    getAvailableProviders: authService.getAvailableProviders.bind(authService)
  };
};
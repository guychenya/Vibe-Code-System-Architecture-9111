import OIDCClient from '../lib/oidc-client.js';
import { OIDC_PROVIDERS } from '../lib/oidc-config.js';
import supabase from '../lib/supabase.js';
import { getUserProfile } from './db-service.js';

class AuthService {
  constructor() {
    this.clients = {};
    this.currentUser = null;
    this.listeners = new Set();

    // Initialize OIDC clients for each provider
    Object.keys(OIDC_PROVIDERS).forEach(providerId => {
      this.clients[providerId] = new OIDCClient(providerId);
    });

    // Check for existing session on initialization
    this.initializeSession();
  }

  // Initialize session from stored data
  async initializeSession() {
    // First check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          // Get additional profile data if needed
          const profile = await getUserProfile(user.id);
          
          this.currentUser = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
            avatar: user.user_metadata?.avatar_url,
            provider: 'github',
            profile: profile || {},
            createdAt: user.created_at
          };
          
          this.notifyListeners();
          return;
        } catch (error) {
          console.error('Error getting user profile:', error);
        }
      }
    }

    // Fallback to OIDC clients if Supabase auth fails
    for (const [providerId, client] of Object.entries(this.clients)) {
      if (client.isAuthenticated()) {
        this.currentUser = client.getCurrentUser();
        this.notifyListeners();
        break;
      }
    }
  }

  // Add authentication state listener
  addAuthListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners of auth state changes
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentUser);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  // Sign in with GitHub through Supabase
  async signIn(providerId) {
    try {
      if (providerId === 'github') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback/github`
          }
        });
        
        if (error) throw error;
        return data;
      } else {
        // Fallback to OIDC client
        const client = this.clients[providerId];
        if (!client) {
          throw new Error(`Unknown provider: ${providerId}`);
        }
        
        await client.authorize();
      }
    } catch (error) {
      console.error(`Sign in failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleCallback(providerId, searchParams) {
    try {
      if (providerId === 'github') {
        // Get session from URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) throw new Error('No session found after authentication');
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found after authentication');
        
        // Get or create user profile
        let profile = await getUserProfile(user.id);
        
        this.currentUser = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
          avatar: user.user_metadata?.avatar_url,
          provider: 'github',
          profile: profile || {},
          createdAt: user.created_at
        };
        
        this.notifyListeners();
        return this.currentUser;
      } else {
        // Fallback to OIDC client
        const client = this.clients[providerId];
        if (!client) {
          throw new Error(`Unknown provider: ${providerId}`);
        }
        
        const user = await client.handleCallback(searchParams);
        this.currentUser = user;
        this.notifyListeners();
        return user;
      }
    } catch (error) {
      console.error(`Callback handling failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Sign out current user
  async signOut() {
    try {
      // First try Supabase signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Also sign out from OIDC if needed
      if (this.currentUser && this.currentUser.provider && this.currentUser.provider !== 'github') {
        const providerId = this.currentUser.provider;
        const client = this.clients[providerId];
        if (client) {
          await client.signOut();
        }
      }
      
      this.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Get user permissions/roles
  getUserPermissions() {
    if (!this.currentUser) return [];

    // Basic permissions based on provider
    const basePermissions = ['read', 'write'];

    // Add provider-specific permissions
    if (this.currentUser.provider === 'github') {
      basePermissions.push('repo_access', 'code_review');
    }
    
    return basePermissions;
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // Get available providers
  getAvailableProviders() {
    return Object.keys(OIDC_PROVIDERS).map(id => ({
      id,
      name: OIDC_PROVIDERS[id].name,
      logo: OIDC_PROVIDERS[id].logo
    }));
  }

  // Security audit log
  logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      user: this.currentUser?.id || 'anonymous',
      provider: this.currentUser?.provider || 'none',
      details,
      userAgent: navigator.userAgent,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Security Event:', logEntry);
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
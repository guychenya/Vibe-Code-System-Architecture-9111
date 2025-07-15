import OIDCClient from '../lib/oidc-client.js';
import { OIDC_PROVIDERS } from '../lib/oidc-config.js';

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
  initializeSession() {
    // Check all providers for an existing session
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

  // Sign in with specified provider
  async signIn(providerId) {
    try {
      const client = this.clients[providerId];
      if (!client) {
        throw new Error(`Unknown provider: ${providerId}`);
      }

      await client.authorize();
    } catch (error) {
      console.error(`Sign in failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleCallback(providerId, searchParams) {
    try {
      const client = this.clients[providerId];
      if (!client) {
        throw new Error(`Unknown provider: ${providerId}`);
      }

      const user = await client.handleCallback(searchParams);
      this.currentUser = user;
      this.notifyListeners();
      
      return user;
    } catch (error) {
      console.error(`Callback handling failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Sign out current user
  async signOut() {
    try {
      if (this.currentUser) {
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
    return !!this.currentUser && this.validateCurrentSession();
  }

  // Validate current session
  validateCurrentSession() {
    if (!this.currentUser) return false;

    const providerId = this.currentUser.provider;
    const client = this.clients[providerId];
    
    return client ? client.isAuthenticated() : false;
  }

  // Refresh authentication token
  async refreshToken() {
    if (!this.currentUser) return false;

    try {
      const providerId = this.currentUser.provider;
      const client = this.clients[providerId];
      
      if (!client) return false;

      const isValid = await client.validateAndRefreshToken();
      if (!isValid) {
        this.currentUser = null;
        this.notifyListeners();
      }
      
      return isValid;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.currentUser = null;
      this.notifyListeners();
      return false;
    }
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
    
    if (this.currentUser.provider === 'netlify') {
      basePermissions.push('deploy', 'site_management');
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
      ip: 'client-side' // Would need server-side implementation for real IP
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Security Event:', logEntry);
    }

    // In production, send to security monitoring service
    // this.sendToSecurityService(logEntry);
  }

  // Validate session periodically
  startSessionValidation() {
    setInterval(async () => {
      if (this.isAuthenticated()) {
        await this.refreshToken();
      }
    }, 60000); // Check every minute
  }
}

// Create singleton instance
const authService = new AuthService();

// Start session validation
authService.startSessionValidation();

export default authService;
import supabase from '../lib/supabase.js';

class AuthService {
  constructor() {
    this.securityEvents = [];
    this.authListeners = [];
  }

  // Sign in with provider
  async signIn(providerId) {
    try {
      if (providerId === 'github') {
        // Use Supabase auth for GitHub with Netlify URL
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: 'https://tubular-sunshine-555194.netlify.app/auth/callback/github',
            scopes: 'user:email read:user'
          }
        });
        
        if (error) throw error;
        return data;
      } else {
        throw new Error(`Provider ${providerId} is not supported yet`);
      }
    } catch (error) {
      console.error(`Sign in failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Handle callback from OAuth provider
  async handleCallback(providerId, searchParams) {
    try {
      if (providerId === 'github') {
        // For GitHub, Supabase handles the callback automatically
        // We just need to get the session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) throw new Error('No session found after authentication');

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found after authentication');

        // Return user info
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
          avatar: user.user_metadata?.avatar_url,
          provider: 'github',
          createdAt: user.created_at
        };
      } else {
        throw new Error(`Provider ${providerId} is not supported yet`);
      }
    } catch (error) {
      console.error(`Callback handling failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear any local session storage
      localStorage.removeItem('user_session');
      sessionStorage.removeItem('user_session');
      
      // Notify listeners
      this.authListeners.forEach(callback => callback(null));
      
      return true;
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      // Check local storage first for cached user
      const storedUser = localStorage.getItem('user_session') || sessionStorage.getItem('user_session');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          // Clear invalid stored data
          localStorage.removeItem('user_session');
          sessionStorage.removeItem('user_session');
        }
      }
      
      // No user found
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user;
  }

  // Check if user has permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Simple role-based permission check
    const userRole = user.role || 'user';

    // Define role hierarchy
    const roles = {
      admin: ['admin', 'editor', 'user'],
      editor: ['editor', 'user'],
      user: ['user']
    };

    // Check if the user's role has the required permission
    return roles[userRole] && roles[userRole].includes(permission);
  }

  // Get available providers
  getAvailableProviders() {
    return [
      { id: 'github', name: 'GitHub' }
    ];
  }

  // Log security event
  logSecurityEvent(eventType, details = {}) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUser()?.id,
      ...details
    };

    this.securityEvents.push(event);
    console.log('Security event:', event);

    // Keep only last 100 events to prevent memory issues
    if (this.securityEvents.length > 100) {
      this.securityEvents = this.securityEvents.slice(-100);
    }

    return event;
  }

  // Add auth state change listener
  addAuthListener(callback) {
    this.authListeners.push(callback);

    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || session.user.email)}&background=0ea5e9&color=fff`,
          provider: session.user.app_metadata?.provider || 'email',
          role: session.user.role || 'user',
          createdAt: session.user.created_at
        };

        // Store user in local storage
        localStorage.setItem('user_session', JSON.stringify(user));

        // Notify all listeners
        this.authListeners.forEach(cb => cb(user));
      } else if (event === 'SIGNED_OUT') {
        // Clear stored user
        localStorage.removeItem('user_session');
        sessionStorage.removeItem('user_session');

        // Notify all listeners
        this.authListeners.forEach(cb => cb(null));
      }
    });

    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
      subscription.unsubscribe();
    };
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
import CryptoJS from 'crypto-js';
import { OIDC_PROVIDERS, SECURITY_CONFIG } from './oidc-config.js';

class OIDCClient {
  constructor(providerId) {
    this.provider = OIDC_PROVIDERS[providerId];
    this.providerId = providerId;
    
    if (!this.provider) {
      throw new Error(`Unknown OIDC provider: ${providerId}`);
    }
  }

  // Generate secure random state and nonce
  generateSecureRandom() {
    return CryptoJS.lib.WordArray.random(128/8).toString();
  }

  // Generate PKCE code verifier and challenge
  generatePKCE() {
    const codeVerifier = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Base64url);
    const codeChallenge = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64url);
    
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256'
    };
  }

  // Encrypt sensitive data
  encryptData(data, key = 'vibe-code-secret') {
    if (!SECURITY_CONFIG.encryptTokens) return data;
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  // Decrypt sensitive data
  decryptData(encryptedData, key = 'vibe-code-secret') {
    if (!SECURITY_CONFIG.encryptTokens) return encryptedData;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  // Store data securely
  secureStore(key, data) {
    const storage = SECURITY_CONFIG.tokenStorage === 'localStorage' ? localStorage : sessionStorage;
    const encryptedData = this.encryptData(data);
    storage.setItem(key, encryptedData);
  }

  // Retrieve data securely
  secureRetrieve(key) {
    const storage = SECURITY_CONFIG.tokenStorage === 'localStorage' ? localStorage : sessionStorage;
    const encryptedData = storage.getItem(key);
    if (!encryptedData) return null;
    return this.decryptData(encryptedData);
  }

  // Clear secure storage
  secureClear(key) {
    const storage = SECURITY_CONFIG.tokenStorage === 'localStorage' ? localStorage : sessionStorage;
    storage.removeItem(key);
  }

  // Initiate OIDC authorization flow
  async authorize() {
    try {
      const state = this.generateSecureRandom();
      const nonce = this.generateSecureRandom();
      const pkce = this.generatePKCE();

      // Store state, nonce, and PKCE securely
      this.secureStore('oidc_state', state);
      this.secureStore('oidc_nonce', nonce);
      this.secureStore('oidc_code_verifier', pkce.codeVerifier);

      const authUrl = new URL(this.provider.authorization_endpoint);
      const params = {
        client_id: this.provider.client_id,
        redirect_uri: this.provider.redirect_uri,
        response_type: this.provider.response_type,
        scope: this.provider.scope,
        state: state,
        nonce: nonce,
        code_challenge: pkce.codeChallenge,
        code_challenge_method: pkce.codeChallengeMethod
      };

      Object.entries(params).forEach(([key, value]) => {
        authUrl.searchParams.append(key, value);
      });

      // Redirect to authorization endpoint
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Authorization failed:', error);
      throw new Error('Failed to initiate authorization');
    }
  }

  // Handle authorization callback
  async handleCallback(searchParams) {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        throw new Error(`Authorization error: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state');
      }

      // Verify state
      const storedState = this.secureRetrieve('oidc_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code);
      
      // Get user information
      const userInfo = await this.getUserInfo(tokens.access_token);

      // Store user session
      const user = {
        id: userInfo.id || userInfo.sub,
        name: userInfo.name || userInfo.login,
        email: userInfo.email,
        avatar: userInfo.avatar_url || userInfo.picture,
        provider: this.providerId,
        tokens: tokens,
        createdAt: new Date().toISOString()
      };

      this.secureStore('user_session', user);
      this.secureStore('access_token', tokens.access_token);
      if (tokens.refresh_token) {
        this.secureStore('refresh_token', tokens.refresh_token);
      }

      // Clean up temporary storage
      this.secureClear('oidc_state');
      this.secureClear('oidc_nonce');
      this.secureClear('oidc_code_verifier');

      return user;
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code) {
    const codeVerifier = this.secureRetrieve('oidc_code_verifier');
    
    const tokenData = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.provider.redirect_uri,
      client_id: this.provider.client_id,
      client_secret: this.provider.client_secret,
      code_verifier: codeVerifier
    };

    const response = await fetch(this.provider.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(tokenData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Token exchange failed: ${errorData.error || response.statusText}`);
    }

    return await response.json();
  }

  // Get user information using access token
  async getUserInfo(accessToken) {
    const response = await fetch(this.provider.userinfo_endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    return await response.json();
  }

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = this.secureRetrieve('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenData = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.provider.client_id,
      client_secret: this.provider.client_secret
    };

    const response = await fetch(this.provider.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(tokenData)
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    this.secureStore('access_token', tokens.access_token);
    
    if (tokens.refresh_token) {
      this.secureStore('refresh_token', tokens.refresh_token);
    }

    return tokens;
  }

  // Sign out user
  async signOut() {
    // Clear all stored data
    this.secureClear('user_session');
    this.secureClear('access_token');
    this.secureClear('refresh_token');
    this.secureClear('oidc_state');
    this.secureClear('oidc_nonce');
    this.secureClear('oidc_code_verifier');

    // Optional: Revoke tokens on provider side
    // This depends on provider support
  }

  // Get current user session
  getCurrentUser() {
    return this.secureRetrieve('user_session');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser();
    const accessToken = this.secureRetrieve('access_token');
    
    if (!user || !accessToken) return false;

    // Check session timeout
    const sessionStart = new Date(user.createdAt);
    const now = new Date();
    const sessionAge = now.getTime() - sessionStart.getTime();
    
    if (sessionAge > SECURITY_CONFIG.sessionTimeout) {
      this.signOut();
      return false;
    }

    return true;
  }

  // Validate token expiry and refresh if needed
  async validateAndRefreshToken() {
    if (!this.isAuthenticated()) return false;

    const tokens = this.secureRetrieve('user_session')?.tokens;
    if (!tokens) return false;

    // Check if token is about to expire
    const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;
    const now = new Date();
    
    if (expiresAt && (expiresAt.getTime() - now.getTime()) < SECURITY_CONFIG.refreshTokenThreshold) {
      try {
        await this.refreshAccessToken();
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.signOut();
        return false;
      }
    }

    return true;
  }
}

export default OIDCClient;
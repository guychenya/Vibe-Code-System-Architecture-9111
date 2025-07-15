// OIDC Configuration for GitHub and Netlify
export const OIDC_PROVIDERS = {
  github: {
    name: 'GitHub',
    authority: 'https://github.com',
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || 'your-github-client-id',
    client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET || 'your-github-client-secret',
    redirect_uri: `${window.location.origin}/auth/callback/github`,
    scope: 'user:email read:user',
    response_type: 'code',
    authorization_endpoint: 'https://github.com/login/oauth/authorize',
    token_endpoint: 'https://github.com/login/oauth/access_token',
    userinfo_endpoint: 'https://api.github.com/user',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
  },
  netlify: {
    name: 'Netlify',
    authority: 'https://app.netlify.com',
    client_id: import.meta.env.VITE_NETLIFY_CLIENT_ID || 'your-netlify-client-id',
    client_secret: import.meta.env.VITE_NETLIFY_CLIENT_SECRET || 'your-netlify-client-secret',
    redirect_uri: `${window.location.origin}/auth/callback/netlify`,
    scope: 'openid profile email',
    response_type: 'code',
    authorization_endpoint: 'https://app.netlify.com/oauth/authorize',
    token_endpoint: 'https://app.netlify.com/oauth/token',
    userinfo_endpoint: 'https://api.netlify.com/api/v1/user',
    logo: 'https://www.netlify.com/img/press/logos/logomark.png'
  }
};

// Security configuration
export const SECURITY_CONFIG = {
  tokenStorage: 'sessionStorage', // or 'localStorage'
  encryptTokens: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  csrfProtection: true,
  secureHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
};

// JWT configuration
export const JWT_CONFIG = {
  algorithm: 'HS256',
  expiresIn: '1h',
  issuer: 'vibe-code-system',
  audience: 'vibe-code-users'
};
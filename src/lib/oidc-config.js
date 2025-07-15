// OIDC Configuration for GitHub
export const OIDC_PROVIDERS = {
  github: {
    name: 'GitHub',
    authority: 'https://github.com',
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || 'your-github-client-id',
    client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET || 'your-github-client-secret',
    // Updated redirect URI to match Netlify deployment
    redirect_uri: `https://tubular-sunshine-555194.netlify.app/auth/callback/github`,
    scope: 'user:email read:user',
    response_type: 'code',
    authorization_endpoint: 'https://github.com/login/oauth/authorize',
    token_endpoint: 'https://github.com/login/oauth/access_token',
    userinfo_endpoint: 'https://api.github.com/user',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
  }
};

export const SECURITY_CONFIG = {
  tokenStorage: 'localStorage',
  encryptTokens: false,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenThreshold: 5 * 60 * 1000 // 5 minutes
};
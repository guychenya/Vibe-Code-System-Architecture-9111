# Vibe Code System - OIDC Authentication

A comprehensive development workflow management system with secure OpenID Connect authentication.

## 🔐 Authentication Features

### Supported Providers
- **GitHub OAuth** - Sign in with GitHub credentials
- **Netlify Identity** - Sign in with Netlify account
- **Extensible** - Easy to add more OIDC providers

### Security Features
- **PKCE (Proof Key for Code Exchange)** - Enhanced security for OAuth flows
- **Token Encryption** - Secure storage of access tokens
- **Session Management** - Automatic token refresh and validation
- **CSRF Protection** - Cross-site request forgery prevention
- **Secure Storage** - Encrypted session/local storage

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### 2. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - Application name: `Vibe Code System`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/auth/callback/github`
3. Add your Client ID and Secret to `.env`

### 3. Netlify Identity Setup

1. Go to Netlify Dashboard → Site Settings → Identity
2. Enable Identity service
3. Configure OAuth providers if needed
4. Add your Client ID and Secret to `.env`

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

## 🔧 Configuration

### OIDC Providers

Configure providers in `src/lib/oidc-config.js`:

```javascript
export const OIDC_PROVIDERS = {
  github: {
    name: 'GitHub',
    client_id: process.env.VITE_GITHUB_CLIENT_ID,
    // ... other config
  },
  netlify: {
    name: 'Netlify',
    client_id: process.env.VITE_NETLIFY_CLIENT_ID,
    // ... other config
  }
};
```

### Security Settings

Customize security in `src/lib/oidc-config.js`:

```javascript
export const SECURITY_CONFIG = {
  tokenStorage: 'sessionStorage', // or 'localStorage'
  encryptTokens: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  // ... other settings
};
```

## 🛡️ Security Best Practices

### Implemented Security Measures

1. **Token Encryption** - All tokens are encrypted before storage
2. **PKCE Flow** - Prevents authorization code interception
3. **State Validation** - Prevents CSRF attacks
4. **Session Timeout** - Automatic logout after inactivity
5. **Token Refresh** - Automatic token renewal
6. **Secure Headers** - XSS and clickjacking protection

### Usage Examples

#### Basic Authentication

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn('github')}>
          Sign in with GitHub
        </button>
      )}
    </div>
  );
}
```

#### Protected Routes

```javascript
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requiredPermission="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

## 📚 API Reference

### AuthService

Main authentication service with the following methods:

- `signIn(providerId)` - Initiate OAuth flow
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current user data
- `isAuthenticated()` - Check auth status
- `refreshToken()` - Refresh access token

### useAuth Hook

React hook for authentication state:

```javascript
const {
  user,              // Current user object
  isAuthenticated,   // Boolean auth status
  isLoading,         // Loading state
  error,             // Error message
  signIn,            // Sign in function
  signOut,           // Sign out function
  hasPermission,     // Check user permissions
} = useAuth();
```

## 🔒 Security Considerations

### Production Deployment

1. **HTTPS Only** - Always use HTTPS in production
2. **Environment Variables** - Never commit secrets to version control
3. **Token Rotation** - Implement regular token rotation
4. **Audit Logging** - Log all authentication events
5. **Rate Limiting** - Implement authentication rate limiting

### Vulnerability Prevention

- **XSS Protection** - Content Security Policy headers
- **CSRF Prevention** - State parameter validation
- **Token Leakage** - Secure token storage and transmission
- **Session Fixation** - Proper session management

## 📊 Monitoring & Logging

The system includes comprehensive security event logging:

```javascript
// Security events are automatically logged
authService.logSecurityEvent('sign_in_attempt', { 
  provider: 'github',
  timestamp: new Date().toISOString()
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure callback URLs match exactly in provider settings

2. **Token Refresh Failures**
   - Check if refresh tokens are properly stored
   - Verify token expiration handling

3. **CORS Issues**
   - Configure proper CORS headers for your domain

4. **State Mismatch**
   - Clear browser storage and try again
   - Check for timing issues in state validation

### Debug Mode

Enable debug logging in development:

```javascript
// In oidc-config.js
export const DEBUG_MODE = import.meta.env.DEV;
```

## 📈 Performance Optimization

- **Token Caching** - Efficient token storage and retrieval
- **Lazy Loading** - Auth components loaded on demand
- **Session Validation** - Periodic background validation
- **Memory Management** - Proper cleanup of auth listeners

## 🔄 Migration Guide

### From Legacy Auth

If migrating from a legacy authentication system:

1. Update import statements to use new `useAuth` hook
2. Replace direct API calls with auth service methods
3. Update route protection to use `ProtectedRoute` component
4. Configure OIDC providers in environment variables

This implementation provides enterprise-grade security with a developer-friendly API, ensuring your application is both secure and maintainable.
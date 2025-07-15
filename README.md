# Vibe Code System - GitHub OAuth Setup Guide

## 🔐 GitHub OAuth Configuration

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: `Vibe Code System`
   - **Homepage URL**: `https://tubular-sunshine-555194.netlify.app`
   - **Application description**: `Development workflow management system`
   - **Authorization callback URL**: `https://tubular-sunshine-555194.netlify.app/auth/callback/github`

### Step 2: Configure Supabase Authentication

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL** to: `https://tubular-sunshine-555194.netlify.app`
4. Add to **Redirect URLs**: `https://tubular-sunshine-555194.netlify.app/auth/callback/github`
5. Navigate to **Authentication** → **Providers**
6. Find **GitHub** in the list and click **Enable**
7. Add your GitHub OAuth credentials:
   - **Client ID**: From your GitHub OAuth app
   - **Client Secret**: From your GitHub OAuth app

### Step 3: Update Environment Variables

For Netlify deployment, add these environment variables in your Netlify dashboard:

```env
VITE_SUPABASE_URL=https://brsvohizxhjahecgiulo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc3ZvaGl6eGhqYWhlY2dpdWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzI5MzEsImV4cCI6MjA2ODE0ODkzMX0.8hHc4SP8S72v8CLzHSbLJXXx_--_LOs1W1TS6dr_Feg
```

### Step 4: Test the Authentication

1. Deploy to Netlify
2. Navigate to your deployed app at `https://tubular-sunshine-555194.netlify.app`
3. Click "Continue with GitHub"
4. You should be redirected to GitHub for authorization
5. After approval, you'll be redirected back to your app

## 🚨 Configuration Checklist

### GitHub OAuth App Settings
- **Homepage URL**: `https://tubular-sunshine-555194.netlify.app`
- **Authorization callback URL**: `https://tubular-sunshine-555194.netlify.app/auth/callback/github`

### Supabase Configuration
- **Site URL**: `https://tubular-sunshine-555194.netlify.app`
- **Redirect URLs**: `https://tubular-sunshine-555194.netlify.app/auth/callback/github`
- **GitHub Provider**: Enabled with your Client ID and Secret

### Netlify Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🔍 Local Development

For local development, you'll need a separate GitHub OAuth app:

1. Create a new GitHub OAuth app for development
2. Set the callback URL to: `http://localhost:5173/auth/callback/github`
3. Update your local `.env` with the development credentials

## 🛡️ Security Notes

- Never commit OAuth secrets to version control
- Use environment variables for all sensitive data
- Regularly rotate your OAuth credentials
- Monitor authentication logs for suspicious activity

This configuration ensures secure GitHub OAuth authentication through Supabase with proper Netlify deployment support.
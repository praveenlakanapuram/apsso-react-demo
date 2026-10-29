// SSO Configuration for the application
export const SSO_CONFIG = {
  // SSO Auth Service endpoint
  authServiceUrl: import.meta.env.VITE_SSO_AUTH_URL || 'http://localhost:3007',
  
  // Registered OAuth Client ID from SSO Admin Portal
  clientId: import.meta.env.VITE_SSO_CLIENT_ID || 'sso_react_demo_client',
  
  // Callback URL registered in SSO Admin
  redirectUri: `${window.location.origin}/callback`,
  
  // Requested user profile scopes
  scopes: ['openid', 'profile', 'email', 'roles', 'department'],
};

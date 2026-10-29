// SSO Configuration for the application
export const SSO_CONFIG = {
  // SSO Auth Service endpoint
  authServiceUrl: import.meta.env.VITE_SSO_AUTH_URL || 'https://apsso.online',
  
  // Registered OAuth Client ID from SSO Admin Portal
  clientId: import.meta.env.VITE_SSO_CLIENT_ID || 'sso_57996c95a436bf99967927fe4e6fd15e',
  
  // Callback URL registered in SSO Admin
  redirectUri: `${window.location.origin}/callback`,
  
  // Requested user profile scopes
  scopes: ['openid', 'profile', 'email', 'roles', 'department'],
};

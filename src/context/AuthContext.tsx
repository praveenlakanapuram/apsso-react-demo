import React, { createContext, useContext, useState, useEffect } from 'react';
import { SSOAuth, type AuthUser, type AuthTokens } from '@ap-sso/auth-sdk';
import { SSO_CONFIG } from '../config/sso';

interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  handleCallback: () => Promise<AuthUser>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Read client ID from URL query if launched via Launchpad, or fallback to config
  const urlParams = new URLSearchParams(window.location.search);
  const urlClientId = urlParams.get('sso_client_id');
  if (urlClientId) {
    localStorage.setItem('sso_demo_client_id', urlClientId);
  }
  const effectiveClientId = urlClientId || localStorage.getItem('sso_demo_client_id') || SSO_CONFIG.clientId;

  // Initialize the SDK
  const ssoAuth = new SSOAuth({
    domain: new URL(SSO_CONFIG.authServiceUrl).hostname,
    clientId: effectiveClientId,
    redirectUri: SSO_CONFIG.redirectUri,
    scopes: SSO_CONFIG.scopes,
    authServiceUrl: SSO_CONFIG.authServiceUrl,
  });

  // Load existing session on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('sso_demo_user');
    const savedTokens = localStorage.getItem('sso_tokens');

    if (savedUser && savedTokens) {
      try {
        setUser(JSON.parse(savedUser));
        setTokens(JSON.parse(savedTokens));
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
    setLoading(false);
  }, []);

  // Redirect user to AP SSO login page
  const login = () => {
    sessionStorage.removeItem('sso_user_logged_out');
    ssoAuth.platformLogin();
  };

  // Process the OAuth callback (exchanges code for tokens)
  const handleCallback = async (): Promise<AuthUser> => {
    const receivedTokens = await ssoAuth.platformHandleCallback();
    setTokens(receivedTokens);

    const profile = await ssoAuth.platformGetUserInfo();
    if (!profile) {
      throw new Error('Could not retrieve user profile from SSO.');
    }

    localStorage.setItem('sso_demo_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  // Refresh access token
  const refreshToken = async (): Promise<string | null> => {
    const newAccessToken = await ssoAuth.getToken();
    const currentTokens = localStorage.getItem('sso_tokens');
    if (currentTokens) {
      setTokens(JSON.parse(currentTokens));
    }
    return newAccessToken;
  };

  // Clear local session and redirect to SSO logout
  const logout = async () => {
    try {
      const token = await ssoAuth.getToken();
      if (token) {
        await fetch(`${SSO_CONFIG.authServiceUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (err) {
      console.warn('Server token revocation failed:', err);
    }

    // Clear local storage
    localStorage.removeItem('sso_demo_user');
    localStorage.removeItem('sso_tokens');
    localStorage.removeItem('sso_platform_state');
    localStorage.removeItem('sso_platform_code_verifier');
    sessionStorage.setItem('sso_user_logged_out', 'true');

    setUser(null);
    setTokens(null);

    // Skip redirect if running in iframe (for Single Logout)
    if (window !== window.top) return;

    // Redirect to SSO logout page
    const postLogoutUrl = encodeURIComponent(window.location.origin + '/login');
    window.location.href = `${SSO_CONFIG.authServiceUrl}/oauth/logout?post_logout_redirect_uri=${postLogoutUrl}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        login,
        logout,
        refreshToken,
        handleCallback,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

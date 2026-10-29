import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SSO_CONFIG } from '../config/sso';
import { FiLogIn, FiShield, FiExternalLink } from 'react-icons/fi';

export default function Login() {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle auto-login trigger from Launchpad (e.g. ?sso_login=true)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoLogin = urlParams.get('sso_login') === 'true';
    const wasLoggedOut = sessionStorage.getItem('sso_user_logged_out') === 'true';

    if (autoLogin && !isAuthenticated && !wasLoggedOut) {
      login();
    }
  }, [isAuthenticated, login]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card-header">
          <div className="logo-badge">
            <FiShield size={32} />
          </div>
          <h2>AP SSO Vendor Demo</h2>
          <p className="subtitle">OAuth 2.0 / OIDC with PKCE (React JS)</p>
        </div>

        <div className="config-box">
          <div className="config-title">Integration Parameters</div>
          <div className="config-row">
            <span>Auth Server:</span>
            <code>{SSO_CONFIG.authServiceUrl}</code>
          </div>
          <div className="config-row">
            <span>Client ID:</span>
            <code>{SSO_CONFIG.clientId}</code>
          </div>
          <div className="config-row">
            <span>Redirect URI:</span>
            <code>{SSO_CONFIG.redirectUri}</code>
          </div>
        </div>

        <button className="primary-btn" onClick={login}>
          <FiLogIn size={18} />
          <span>Sign In with AP SSO</span>
          <FiExternalLink size={14} style={{ opacity: 0.7 }} />
        </button>
      </div>
    </div>
  );
}

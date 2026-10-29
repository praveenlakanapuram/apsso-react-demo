import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiBriefcase, 
  FiLogOut, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiKey, 
  FiCode 
} from 'react-icons/fi';

export default function Dashboard() {
  const { user, tokens, logout, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');
  const [showJson, setShowJson] = useState(false);

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Handle token refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg('');
    try {
      const newToken = await refreshToken();
      if (newToken) {
        setRefreshMsg('Token refreshed successfully!');
      } else {
        setRefreshMsg('Could not refresh token. Session may have expired.');
      }
    } catch (e) {
      setRefreshMsg('Error refreshing token: ' + (e as Error).message);
    } finally {
      setRefreshing(false);
      setTimeout(() => setRefreshMsg(''), 4000);
    }
  };

  // Helper for user avatar initials
  const initials = (user.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="logo-dot"></div>
          <strong>AP SSO</strong>
          <span className="badge">Vendor App (React)</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* User Overview Card */}
        <div className="card profile-card">
          <div className="avatar">{initials}</div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="profile-meta">
              <span>CFMS ID: <strong>{user.cfmsId || user.preferred_username || 'N/A'}</strong></span>
              <span>•</span>
              <span>Email: <strong>{user.email || 'N/A'}</strong></span>
            </p>
          </div>
          <div className="status-badge">
            <FiCheckCircle size={14} />
            <span>Authenticated</span>
          </div>
        </div>

        <div className="grid-2">
          {/* Department & Post Details */}
          <div className="card">
            <div className="card-title">
              <FiBriefcase size={18} />
              <span>Designation & Department</span>
            </div>
            <div className="details-list">
              <div className="detail-row">
                <span className="label">Post / Role:</span>
                <span className="val">{user.postName || user.role || 'Officer'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Department:</span>
                <span className="val">{user.deptName || 'Government of Andhra Pradesh'}</span>
              </div>
              <div className="detail-row">
                <span className="label">District:</span>
                <span className="val">{user.apcfssDistrictName || 'All Districts'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Subject (Sub ID):</span>
                <span className="val mono">{user.sub}</span>
              </div>
            </div>
          </div>

          {/* Token Management */}
          <div className="card">
            <div className="card-title">
              <FiKey size={18} />
              <span>Session Tokens</span>
            </div>
            <p className="subtitle">Managed securely via @ap-sso/auth-sdk</p>

            <div className="token-box">
              <div className="token-label">Access Token:</div>
              <code className="token-val">
                {tokens?.accessToken
                  ? `${tokens.accessToken.substring(0, 36)}...`
                  : 'Stored in SDK session'}
              </code>
            </div>

            <div className="token-actions">
              <button 
                className="secondary-btn" 
                onClick={handleRefresh} 
                disabled={refreshing}
              >
                <FiRefreshCw size={14} className={refreshing ? 'spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Token'}</span>
              </button>
              {refreshMsg && <span className="refresh-msg">{refreshMsg}</span>}
            </div>
          </div>
        </div>

        {/* Raw Claims Viewer */}
        <div className="card">
          <div className="card-header-row">
            <div className="card-title">
              <FiCode size={18} />
              <span>Raw Claims (OIDC UserInfo)</span>
            </div>
            <button 
              className="link-btn" 
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? 'Hide JSON' : 'Show JSON'}
            </button>
          </div>
          {showJson && (
            <pre className="json-dump">
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}

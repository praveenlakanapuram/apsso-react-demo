import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle } from 'react-icons/fi';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local session upon arriving at logout endpoint
    logout().then(() => {
      // If not running in an iframe (SLO), redirect to login
      if (window === window.top) {
        navigate('/login', { replace: true });
      }
    });
  }, [logout, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card text-center">
        <div className="status-icon success">
          <FiCheckCircle size={40} />
        </div>
        <h3>Signed Out</h3>
        <p className="subtitle">Your SSO session has been ended successfully.</p>
        <button className="secondary-btn" onClick={() => navigate('/login')}>
          Return to Login
        </button>
      </div>
    </div>
  );
}

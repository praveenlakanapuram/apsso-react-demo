import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function Callback() {
  const { handleCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (processedRef.current) return;
    processedRef.current = true;

    // Exchange the authorization code for tokens
    handleCallback()
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch((err: Error) => {
        console.error('Callback handling error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
      });
  }, [handleCallback, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card text-center">
        {error ? (
          <div>
            <div className="error-icon">
              <FiAlertCircle size={40} />
            </div>
            <h3>Authentication Failed</h3>
            <p className="error-text">{error}</p>
            <button className="secondary-btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="spinner">
              <FiLoader size={40} />
            </div>
            <h3>Completing Sign-In</h3>
            <p className="subtitle">Exchanging code for tokens with AP SSO...</p>
          </div>
        )}
      </div>
    </div>
  );
}

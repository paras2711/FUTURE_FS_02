import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Apply custom gradient background to body for login page specifically
  useEffect(() => {
    document.body.classList.add('login-page-active');
    return () => {
      document.body.classList.remove('login-page-active');
    };
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        login(res.data.token, res.data.admin);
        addToast('Welcome back! Login successful.', 'success');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card">
        <div className="login-header">
          <span className="login-logo">⚡</span>
          <h2 className="login-title">Mini CRM Admin</h2>
          <p className="login-subtitle">Enter your credentials to manage leads</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'input-error' : ''}`}
              placeholder="admin@crm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? <span className="button-spinner"></span> : 'Login to Dashboard'}
          </button>
        </form>
      </div>

      <style>{`
        /* Scoped to login page wrapper */
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100vw;
          padding: 1.5rem;
        }

        /* Dynamically appended class styling */
        body.login-page-active {
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          border: none;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .login-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .input-error {
          border-color: #ef4444;
        }

        .input-error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        /* Button loading spinner */
        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default Login;

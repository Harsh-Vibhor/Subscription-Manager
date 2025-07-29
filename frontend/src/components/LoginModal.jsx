import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('LoginModal: Attempting login with:', formData.email);
      const result = await login(formData.email, formData.password);
      console.log('LoginModal: Login result:', result);

      if (result.success) {
        console.log('LoginModal: Login successful, navigating to dashboard');
        onClose();
        navigate('/dashboard');
      } else {
        console.log('LoginModal: Login failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('LoginModal: Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={onSwitchToRegister}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#4f46e5', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

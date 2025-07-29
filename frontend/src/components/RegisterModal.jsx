import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('RegisterModal: Attempting registration for:', formData.email);
      const result = await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      console.log('RegisterModal: Registration result:', result);

      if (result.success) {
        console.log('RegisterModal: Registration successful, navigating to dashboard');
        onClose();
        navigate('/dashboard');
      } else {
        console.log('RegisterModal: Registration failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('RegisterModal: Unexpected error:', error);
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
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </div>
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onSwitchToLogin}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#4f46e5', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLoginModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
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
      console.log('AdminLoginModal: Attempting admin login for:', formData.email);
      const result = await adminLogin(formData.email, formData.password);
      console.log('AdminLoginModal: Admin login result:', result);

      if (result.success) {
        console.log('AdminLoginModal: Admin login successful, navigating to admin dashboard');
        onClose();
        navigate('/admin');
      } else {
        console.log('AdminLoginModal: Admin login failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('AdminLoginModal: Unexpected error:', error);
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
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
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
              className="btn btn-admin"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Admin Sign In'}
            </button>
          </div>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '5px',
          color: '#92400e'
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            <strong>Default Admin Credentials:</strong><br />
            Email: admin@subscriptionmanager.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;

import React, { useState } from 'react';
import { subscriptionsAPI } from '../services/api';

const AddSubscriptionModal = ({ categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    billing_cycle: 'monthly',
    next_billing_date: '',
    category_id: '',
    website_url: '',
    cancel_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Validation
      if (!formData.name || !formData.cost || !formData.next_billing_date) {
        setError('Name, cost, and next billing date are required');
        setLoading(false);
        return;
      }

      if (parseFloat(formData.cost) <= 0) {
        setError('Cost must be greater than 0');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        cost: parseFloat(formData.cost),
        category_id: formData.category_id || null
      };

      await subscriptionsAPI.create(submitData);
      onSuccess();
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError(error.response?.data?.error || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" style={{ maxWidth: '500px', width: '90%' }}>
        <h2>✨ Add New Subscription</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Subscription Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Netflix, Spotify"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cost">Cost *</label>
              <input
                type="number"
                step="0.01"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="billing_cycle">Billing Cycle</label>
              <select
                id="billing_cycle"
                name="billing_cycle"
                value={formData.billing_cycle}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="next_billing_date">Next Billing Date *</label>
              <input
                type="date"
                id="next_billing_date"
                name="next_billing_date"
                value={formData.next_billing_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="website_url">Website URL</label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cancel_url">Cancel/Manage URL</label>
            <input
              type="url"
              id="cancel_url"
              name="cancel_url"
              value={formData.cancel_url}
              onChange={handleChange}
              placeholder="https://example.com/cancel"
            />
          </div>

          <div className="form-group form-grid-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description or notes about this subscription"
              style={{ minHeight: '80px' }}
            />
          </div>

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
              {loading ? 'Adding...' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;

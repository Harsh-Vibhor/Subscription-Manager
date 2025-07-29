import React, { useState } from 'react';
import { adminAPI } from '../services/api';

const CategoryManagement = ({ categories, onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1565c0',
    icon: '📋'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
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
      if (editingCategory) {
        await adminAPI.updateCategory(editingCategory.id, formData);
      } else {
        await adminAPI.createCategory(formData);
      }
      
      setShowAddModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', color: '#1565c0', icon: '📋' });
      onUpdate();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon
    });
    setShowAddModal(true);
  };

  const handleToggleStatus = async (categoryId) => {
    try {
      setLoading(true);
      await adminAPI.toggleCategoryStatus(categoryId);
      onUpdate();
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Failed to update category status');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#1565c0', icon: '📋' });
    setError('');
  };

  const commonIcons = ['📋', '🎬', '🌐', '🎭', '🎵', '💻', '📰', '💪', '📚', '🎮', '🏠', '🚗', '✈️', '🍔'];

  return (
    <div style={{ 
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#b71c1c', margin: 0 }}>🏷️ Category Management</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
          <h3>No categories found</h3>
          <p>Create categories to help users organize their subscriptions.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {categories.map(category => (
            <div key={category.id} style={{ 
              padding: '1.5rem',
              border: `2px solid ${category.color}20`,
              borderRadius: '12px',
              background: category.is_active ? `${category.color}10` : '#f5f5f5'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  fontSize: '2rem', 
                  marginBottom: '0.5rem' 
                }}>
                  {category.icon}
                </div>
                <span style={{ 
                  background: category.is_active ? '#e8f5e8' : '#ffebee',
                  color: category.is_active ? '#4caf50' : '#d32f2f',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 style={{ 
                color: category.color, 
                marginBottom: '0.5rem',
                fontSize: '1.2rem'
              }}>
                {category.name}
              </h3>
              
              <p style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                marginBottom: '1rem',
                minHeight: '2.5rem'
              }}>
                {category.description || 'No description'}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '1rem'
              }}>
                <span>{category.subscription_count || 0} subscriptions</span>
                <span style={{ 
                  background: category.color,
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {category.color}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(category)}
                  disabled={loading}
                  style={{
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    flex: 1
                  }}
                >
                  ✏️ Edit
                </button>
                
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  disabled={loading}
                  style={{
                    background: category.is_active ? '#d32f2f' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    flex: 1
                  }}
                >
                  {category.is_active ? '🚫 Disable' : '✅ Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Movies & TV"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this category"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '40px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="icon">Icon</label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                  >
                    {commonIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ background: '#d32f2f' }}
                >
                  {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;

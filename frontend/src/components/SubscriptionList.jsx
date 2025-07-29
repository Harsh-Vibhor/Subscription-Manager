import React, { useState } from 'react';
import { subscriptionsAPI } from '../services/api';

const SubscriptionList = ({ subscriptions, categories, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (subscription) => {
    setEditingId(subscription.id);
    setEditForm({
      name: subscription.name,
      description: subscription.description || '',
      cost: subscription.cost,
      billing_cycle: subscription.billing_cycle,
      next_billing_date: subscription.next_billing_date.split('T')[0],
      category_id: subscription.category_id || '',
      website_url: subscription.website_url || '',
      cancel_url: subscription.cancel_url || ''
    });
  };

  const handleSave = async (id) => {
    try {
      await subscriptionsAPI.update(id, editForm);
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await subscriptionsAPI.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Failed to delete subscription');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilRenewal = (dateString) => {
    const today = new Date();
    const renewalDate = new Date(dateString);
    const diffTime = renewalDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (subscriptions.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        color: '#666'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h3>No subscriptions yet</h3>
        <p>Add your first subscription to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {subscriptions.map(subscription => {
        const isEditing = editingId === subscription.id;
        const daysUntilRenewal = getDaysUntilRenewal(subscription.next_billing_date);
        const isUpcoming = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
        const isOverdue = daysUntilRenewal < 0;

        return (
          <div key={subscription.id} style={{ 
            border: '1px solid #e3f2fd',
            borderRadius: '12px',
            padding: '1.5rem',
            background: isUpcoming ? '#fff3e0' : isOverdue ? '#ffebee' : 'white',
            borderLeft: `4px solid ${subscription.category_color || '#1565c0'}`
          }}>
            {isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.cost}
                    onChange={(e) => setEditForm({...editForm, cost: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Billing Cycle
                  </label>
                  <select
                    value={editForm.billing_cycle}
                    onChange={(e) => setEditForm({...editForm, billing_cycle: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Next Billing Date
                  </label>
                  <input
                    type="date"
                    value={editForm.next_billing_date}
                    onChange={(e) => setEditForm({...editForm, next_billing_date: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Category
                  </label>
                  <select
                    value={editForm.category_id}
                    onChange={(e) => setEditForm({...editForm, category_id: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">No Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={editForm.website_url}
                    onChange={(e) => setEditForm({...editForm, website_url: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '60px'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      background: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(subscription.id)}
                    style={{
                      background: '#1565c0',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#1565c0' }}>{subscription.name}</h3>
                    {subscription.category_name && (
                      <span style={{ 
                        background: subscription.category_color + '20',
                        color: subscription.category_color,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {subscription.category_icon} {subscription.category_name}
                      </span>
                    )}
                  </div>
                  {subscription.description && (
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>{subscription.description}</p>
                  )}
                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                    <span><strong>Cost:</strong> ${subscription.cost} / {subscription.billing_cycle}</span>
                    <span><strong>Next billing:</strong> {formatDate(subscription.next_billing_date)}</span>
                    {daysUntilRenewal >= 0 && (
                      <span style={{ 
                        color: isUpcoming ? '#f57c00' : '#666',
                        fontWeight: isUpcoming ? 'bold' : 'normal'
                      }}>
                        {daysUntilRenewal === 0 ? 'Due today!' : `${daysUntilRenewal} days`}
                      </span>
                    )}
                    {isOverdue && (
                      <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                        {Math.abs(daysUntilRenewal)} days overdue
                      </span>
                    )}
                  </div>
                  {(subscription.website_url || subscription.cancel_url) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                      {subscription.website_url && (
                        <a 
                          href={subscription.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#1565c0', textDecoration: 'none', fontSize: '0.9rem' }}
                        >
                          🌐 Website
                        </a>
                      )}
                      {subscription.cancel_url && (
                        <a 
                          href={subscription.cancel_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#d32f2f', textDecoration: 'none', fontSize: '0.9rem' }}
                        >
                          ❌ Cancel
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(subscription)}
                    style={{
                      background: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    style={{
                      background: '#ffebee',
                      color: '#d32f2f',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionList;

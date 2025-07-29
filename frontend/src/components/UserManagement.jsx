import React, { useState } from 'react';
import { adminAPI } from '../services/api';

const UserManagement = ({ users, onUpdate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggleUserStatus = async (userId) => {
    try {
      setLoading(true);
      await adminAPI.toggleUserStatus(userId);
      onUpdate();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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
        <h2 style={{ color: '#b71c1c', margin: 0 }}>👥 User Management</h2>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          Total Users: {users.length}
        </div>
      </div>

      {users.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3>No users found</h3>
          <p>Users will appear here once they register.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map(user => (
            <div key={user.id} style={{ 
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              padding: '1.5rem',
              background: user.is_active ? 'white' : '#f5f5f5'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{ margin: 0, color: '#b71c1c' }}>
                      {user.first_name} {user.last_name}
                    </h3>
                    <span style={{ 
                      background: user.is_active ? '#e8f5e8' : '#ffebee',
                      color: user.is_active ? '#4caf50' : '#d32f2f',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    fontSize: '0.9rem', 
                    color: '#666',
                    marginBottom: '0.5rem'
                  }}>
                    <span><strong>Email:</strong> {user.email}</span>
                    <span><strong>Joined:</strong> {formatDate(user.created_at)}</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    fontSize: '0.9rem', 
                    color: '#666'
                  }}>
                    <span><strong>Subscriptions:</strong> {user.subscription_count || 0}</span>
                    <span><strong>Monthly Spending:</strong> ${(user.monthly_spending || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleViewUserDetails(user.id)}
                    disabled={loading}
                    style={{
                      background: '#1976d2',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    👁️ View Details
                  </button>
                  
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    disabled={loading}
                    style={{
                      background: user.is_active ? '#d32f2f' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {user.is_active ? '🚫 Deactivate' : '✅ Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <h2>User Details</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#b71c1c', marginBottom: '1rem' }}>
                {selectedUser.user.first_name} {selectedUser.user.last_name}
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <strong>Email:</strong> {selectedUser.user.email}
                </div>
                <div>
                  <strong>Status:</strong> {selectedUser.user.is_active ? 'Active' : 'Inactive'}
                </div>
                <div>
                  <strong>Joined:</strong> {formatDate(selectedUser.user.created_at)}
                </div>
                <div>
                  <strong>Subscriptions:</strong> {selectedUser.subscriptions.length}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#b71c1c', marginBottom: '1rem' }}>Subscriptions</h4>
              {selectedUser.subscriptions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedUser.subscriptions.map(sub => (
                    <div key={sub.id} style={{ 
                      padding: '0.75rem',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{sub.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {sub.category_name && (
                            <span style={{ color: sub.category_color }}>
                              {sub.category_name} • 
                            </span>
                          )}
                          Next: {formatDate(sub.next_billing_date)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        ${sub.cost}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666' }}>No subscriptions</p>
              )}
            </div>

            <div className="form-actions">
              <button 
                onClick={() => setSelectedUser(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

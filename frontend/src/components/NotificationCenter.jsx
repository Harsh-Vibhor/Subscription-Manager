import React, { useState } from 'react';
import { notificationsAPI } from '../services/api';

const NotificationCenter = ({ notifications, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async (id) => {
    try {
      setLoading(true);
      await notificationsAPI.markAsRead(id);
      onUpdate();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await notificationsAPI.markAllAsRead();
      onUpdate();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'renewal_reminder':
        return '🔔';
      case 'payment_due':
        return '💳';
      case 'system_alert':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

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
        <h2 style={{ color: '#0d47a1', margin: 0 }}>
          🔔 Notifications & Reminders
        </h2>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={loading}
            style={{
              background: '#1565c0',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
          <h3>No notifications yet</h3>
          <p>You'll see renewal reminders and important updates here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <>
              <h3 style={{ color: '#0d47a1', marginBottom: '1rem' }}>
                Unread ({unreadNotifications.length})
              </h3>
              {unreadNotifications.map(notification => (
                <div key={notification.id} style={{ 
                  padding: '1.5rem',
                  background: '#e3f2fd',
                  border: '1px solid #1565c0',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1565c0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                      <h4 style={{ margin: 0, color: '#0d47a1' }}>
                        {notification.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1565c0',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        textDecoration: 'underline'
                      }}
                    >
                      Mark as read
                    </button>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#424242' }}>
                    {notification.message}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#666'
                  }}>
                    <span>
                      {notification.subscription_name && `Related to: ${notification.subscription_name}`}
                    </span>
                    <span>{formatDate(notification.created_at)}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <>
              {unreadNotifications.length > 0 && (
                <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
              )}
              <h3 style={{ color: '#666', marginBottom: '1rem' }}>
                Read ({readNotifications.length})
              </h3>
              {readNotifications.slice(0, 10).map(notification => (
                <div key={notification.id} style={{ 
                  padding: '1rem',
                  background: '#f8fafc',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  opacity: 0.8
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <h4 style={{ margin: 0, color: '#666' }}>
                      {notification.title}
                    </h4>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    {notification.message}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#999'
                  }}>
                    <span>
                      {notification.subscription_name && `Related to: ${notification.subscription_name}`}
                    </span>
                    <span>{formatDate(notification.created_at)}</span>
                  </div>
                </div>
              ))}
              {readNotifications.length > 10 && (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                  Showing 10 of {readNotifications.length} read notifications
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Notification Settings */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ color: '#0d47a1', marginBottom: '1rem' }}>⚙️ Notification Settings</h4>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Configure when and how you receive notifications about your subscriptions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: '0.9rem' }}>Email reminders 7 days before renewal</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: '0.9rem' }}>Email reminders 1 day before renewal</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" />
            <span style={{ fontSize: '0.9rem' }}>SMS notifications (coming soon)</span>
          </label>
        </div>
        <button style={{
          marginTop: '1rem',
          background: '#1565c0',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;

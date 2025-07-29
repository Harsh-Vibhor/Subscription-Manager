import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { subscriptionsAPI, categoriesAPI, notificationsAPI } from '../services/api';
import SubscriptionList from './SubscriptionList';
import AddSubscriptionModal from './AddSubscriptionModal';
import AnalyticsDashboard from './AnalyticsDashboard';
import NotificationCenter from './NotificationCenter';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptions, setSubscriptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      loadDashboardData();
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load categories first (most important)
      try {
        const catsResponse = await categoriesAPI.getAll();
        setCategories(catsResponse.data.categories || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }

      // Load subscriptions
      try {
        const subsResponse = await subscriptionsAPI.getAll();
        setSubscriptions(subsResponse.data.subscriptions || []);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        setSubscriptions([]);
      }

      // Load analytics
      try {
        const analyticsResponse = await subscriptionsAPI.getAnalytics();
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error('Error loading analytics:', error);
        setAnalytics({ totalMonthlyCost: 0, categoryBreakdown: [], upcomingRenewals: [] });
      }

      // Load notifications
      try {
        const notifResponse = await notificationsAPI.getAll();
        setNotifications(notifResponse.data.notifications || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubscriptionAdded = () => {
    setShowAddModal(false);
    loadDashboardData(); // Refresh data
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#1565c0' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e3f2fd',
            borderTop: '3px solid #1565c0',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#1565c0' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)', margin: 0, padding: 0 }}>
      {/* Debug Info */}
      <div style={{
        background: '#f0f9ff',
        padding: '0.5rem 2rem',
        fontSize: '0.8rem',
        color: '#0369a1',
        borderBottom: '1px solid #bae6fd'
      }}>
        Debug: User = {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'null'} |
        Loading = {loading.toString()} |
        Subscriptions = {subscriptions.length} |
        Categories = {categories.length}
      </div>

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        width: '100%',
        margin: 0
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white'
          }}>
            Subscription Manager
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
              Welcome, {user?.firstName || 'User'} {user?.lastName || ''}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e3f2fd',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'subscriptions', label: 'Subscriptions', icon: '📋' },
            { id: 'categories', label: 'Categories', icon: '🏷️' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'reminders', label: 'Reminders', icon: '🔔' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: activeTab === tab.id ? '#1565c0' : '#666',
                borderBottom: activeTab === tab.id ? '2px solid #1565c0' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '2rem', width: '100%', margin: 0 }}>
        {activeTab === 'overview' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Quick Stats */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#0d47a1', marginBottom: '1rem' }}>📊 Quick Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Total Subscriptions</span>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1565c0' }}>
                    {subscriptions.length}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Monthly Cost</span>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1565c0' }}>
                    ${analytics?.totalMonthlyCost?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Subscriptions */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#0d47a1', marginBottom: '1rem' }}>📋 Recent Subscriptions</h3>
              {subscriptions.length > 0 ? (
                subscriptions.slice(0, 3).map(sub => (
                  <div key={sub.id} style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        Next: {new Date(sub.next_billing_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#1565c0' }}>
                      ${sub.cost}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#666',
                  padding: '2rem 0',
                  fontStyle: 'italic'
                }}>
                  No subscriptions yet. Click "Add Subscription" to get started!
                </div>
              )}
              <button
                onClick={() => setActiveTab('subscriptions')}
                style={{
                  marginTop: '1rem',
                  background: '#1565c0',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                View All
              </button>
            </div>
          </div>
        )}
          
        {activeTab === 'subscriptions' && (
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
              <h2 style={{ color: '#0d47a1', margin: 0 }}>Your Subscriptions</h2>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: '#1565c0',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              >
                + Add Subscription
              </button>
            </div>
            <SubscriptionList
              subscriptions={subscriptions}
              categories={categories}
              onUpdate={loadDashboardData}
            />
          </div>
        )}

        {activeTab === 'categories' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#0d47a1', marginBottom: '2rem' }}>Categories</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {categories.map(category => (
                <div key={category.id} style={{
                  padding: '1.5rem',
                  border: `2px solid ${category.color}20`,
                  borderRadius: '12px',
                  background: `${category.color}10`
                }}>
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '0.5rem'
                  }}>
                    {category.icon}
                  </div>
                  <h3 style={{
                    color: category.color,
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    {category.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    <span>{category.subscription_count || 0} subscriptions</span>
                    <span>${(category.monthly_cost || 0).toFixed(2)}/month</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} subscriptions={subscriptions} />
        )}

        {activeTab === 'reminders' && (
          <NotificationCenter
            notifications={notifications}
            onUpdate={loadDashboardData}
          />
        )}

      </main>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <AddSubscriptionModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSubscriptionAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;

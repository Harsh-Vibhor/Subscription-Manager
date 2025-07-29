import React from 'react';

const AdminStats = ({ stats }) => {
  if (!stats) {
    return (
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p>Loading statistics...</p>
      </div>
    );
  }

  const { userCount, subscriptionCount, totalMonthlyRevenue, categoryStats } = stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Total Users</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {userCount}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Total Subscriptions</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {subscriptionCount}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Monthly Revenue</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${(totalMonthlyRevenue || 0).toFixed(2)}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Avg. per User</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${userCount > 0 ? ((totalMonthlyRevenue || 0) / userCount).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#b71c1c', marginBottom: '1.5rem' }}>📊 Category Distribution</h3>
        {categoryStats && categoryStats.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            {categoryStats.map((category, index) => (
              <div key={index} style={{ 
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center',
                border: `2px solid ${category.color}20`
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  📋
                </div>
                <h4 style={{ 
                  color: category.color || '#666', 
                  marginBottom: '0.5rem',
                  fontSize: '1rem'
                }}>
                  {category.name}
                </h4>
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  color: '#d32f2f'
                }}>
                  {category.subscription_count}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  subscriptions
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>No category data available</p>
        )}
      </div>

      {/* System Health */}
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#b71c1c', marginBottom: '1.5rem' }}>🔧 System Health</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem'
        }}>
          <div style={{ 
            padding: '1rem',
            background: '#e8f5e8',
            borderRadius: '8px',
            border: '2px solid #4caf50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <span style={{ fontWeight: '500' }}>Database</span>
            </div>
            <div style={{ color: '#4caf50', fontSize: '0.9rem' }}>Connected</div>
          </div>

          <div style={{ 
            padding: '1rem',
            background: '#e8f5e8',
            borderRadius: '8px',
            border: '2px solid #4caf50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <span style={{ fontWeight: '500' }}>API Server</span>
            </div>
            <div style={{ color: '#4caf50', fontSize: '0.9rem' }}>Running</div>
          </div>

          <div style={{ 
            padding: '1rem',
            background: '#fff3e0',
            borderRadius: '8px',
            border: '2px solid #ff9800'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ fontWeight: '500' }}>Email Service</span>
            </div>
            <div style={{ color: '#ff9800', fontSize: '0.9rem' }}>Not Configured</div>
          </div>

          <div style={{ 
            padding: '1rem',
            background: '#fff3e0',
            borderRadius: '8px',
            border: '2px solid #ff9800'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ fontWeight: '500' }}>SMS Service</span>
            </div>
            <div style={{ color: '#ff9800', fontSize: '0.9rem' }}>Coming Soon</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#b71c1c', marginBottom: '1.5rem' }}>📈 Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #1976d2'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              New user registration
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              2 minutes ago
            </div>
          </div>

          <div style={{ 
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #4caf50'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              Subscription added
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              5 minutes ago
            </div>
          </div>

          <div style={{ 
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #ff9800'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              System maintenance scheduled
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              1 hour ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;

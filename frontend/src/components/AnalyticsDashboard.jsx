import React from 'react';

const AnalyticsDashboard = ({ analytics, subscriptions }) => {
  if (!analytics) {
    return (
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const { totalMonthlyCost, categoryBreakdown, upcomingRenewals } = analytics;

  // Calculate yearly cost
  const yearlyEstimate = totalMonthlyCost * 12;

  // Get billing cycle distribution
  const billingCycleStats = subscriptions.reduce((acc, sub) => {
    acc[sub.billing_cycle] = (acc[sub.billing_cycle] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Monthly Spending</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${totalMonthlyCost.toFixed(2)}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Yearly Estimate</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${yearlyEstimate.toFixed(2)}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Active Subscriptions</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {subscriptions.length}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Avg. Cost per Sub</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${subscriptions.length > 0 ? (totalMonthlyCost / subscriptions.length).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#0d47a1', marginBottom: '1.5rem' }}>📊 Spending by Category</h3>
        {categoryBreakdown.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryBreakdown.map((category, index) => {
              const percentage = totalMonthlyCost > 0 ? (category.monthly_cost / totalMonthlyCost) * 100 : 0;
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    fontSize: '1.5rem',
                    minWidth: '40px'
                  }}>
                    {category.category_icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontWeight: '500' }}>
                        {category.category_name || 'Uncategorized'}
                      </span>
                      <span style={{ fontWeight: 'bold', color: '#1565c0' }}>
                        ${(category.monthly_cost || 0).toFixed(2)}/month
                      </span>
                    </div>
                    <div style={{ 
                      background: '#e3f2fd',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        background: category.category_color || '#1565c0',
                        height: '100%',
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#666',
                      marginTop: '0.25rem'
                    }}>
                      {category.subscription_count} subscription{category.subscription_count !== 1 ? 's' : ''} • {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>No category data available</p>
        )}
      </div>

      {/* Billing Cycle Distribution */}
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#0d47a1', marginBottom: '1.5rem' }}>🔄 Billing Cycle Distribution</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem'
        }}>
          {Object.entries(billingCycleStats).map(([cycle, count]) => (
            <div key={cycle} style={{ 
              textAlign: 'center',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {cycle === 'monthly' ? '📅' : cycle === 'yearly' ? '🗓️' : cycle === 'weekly' ? '📆' : '⏰'}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1565c0' }}>
                {count}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', textTransform: 'capitalize' }}>
                {cycle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Renewals */}
      <div style={{ 
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#0d47a1', marginBottom: '1.5rem' }}>⏰ Upcoming Renewals (Next 30 Days)</h3>
        {upcomingRenewals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingRenewals.map(renewal => {
              const daysUntil = Math.ceil((new Date(renewal.next_billing_date) - new Date()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysUntil <= 3;
              
              return (
                <div key={renewal.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: isUrgent ? '#ffebee' : '#f8fafc',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${isUrgent ? '#d32f2f' : '#1565c0'}`
                }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {renewal.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {new Date(renewal.next_billing_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#1565c0' }}>
                      ${renewal.cost}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: isUrgent ? '#d32f2f' : '#666',
                      fontWeight: isUrgent ? 'bold' : 'normal'
                    }}>
                      {daysUntil === 0 ? 'Due today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>No upcoming renewals in the next 30 days</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

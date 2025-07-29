import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import CategoryManagement from './CategoryManagement';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    console.log('AdminDashboard useEffect - admin:', admin);
    if (!admin) {
      console.log('No admin found, redirecting to home');
      navigate('/');
    } else {
      console.log('Admin found, loading admin data');
      loadAdminData();
    }
  }, [admin, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('AdminDashboard: Loading admin data...');

      // Load data individually to see which one fails
      try {
        console.log('AdminDashboard: Loading stats...');
        const statsResponse = await adminAPI.getStats();
        console.log('AdminDashboard: Stats loaded:', statsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('AdminDashboard: Error loading stats:', error);
        setStats({ totalUsers: 0, totalSubscriptions: 0, totalRevenue: 0 });
      }

      try {
        console.log('AdminDashboard: Loading users...');
        const usersResponse = await adminAPI.getUsers();
        console.log('AdminDashboard: Users loaded:', usersResponse.data);
        setUsers(usersResponse.data.users || []);
      } catch (error) {
        console.error('AdminDashboard: Error loading users:', error);
        setUsers([]);
      }

      try {
        console.log('AdminDashboard: Loading categories...');
        const categoriesResponse = await adminAPI.getCategories();
        console.log('AdminDashboard: Categories loaded:', categoriesResponse.data);
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error('AdminDashboard: Error loading categories:', error);
        setCategories([]);
      }

      console.log('AdminDashboard: All data loading completed');
    } catch (error) {
      console.error('AdminDashboard: Unexpected error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!admin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffebee 0%, #f8fafc 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.2rem', marginBottom: '1rem' }}>
            No admin user found
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Admin token: {localStorage.getItem('adminToken') ? 'exists' : 'missing'}<br/>
            Admin data: {localStorage.getItem('adminData') ? 'exists' : 'missing'}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Go to Home
          </button>
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
        background: 'linear-gradient(135deg, #ffebee 0%, #f8fafc 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #ffebee',
            borderTop: '3px solid #d32f2f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#d32f2f' }}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffebee 0%, #f8fafc 100%)', margin: 0, padding: 0 }}>
      {/* Debug Info */}
      <div style={{
        background: '#fef2f2',
        padding: '0.5rem 2rem',
        fontSize: '0.8rem',
        color: '#dc2626',
        borderBottom: '1px solid #fecaca'
      }}>
        Debug: Admin = {admin ? `${admin.name} (${admin.email})` : 'null'} |
        Loading = {loading.toString()} |
        Users = {users.length} |
        Categories = {categories.length} |
        Stats = {stats ? 'loaded' : 'null'}
      </div>

      <header style={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
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
            Admin Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
              Welcome, {admin?.name || 'Admin'}
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
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav style={{
        background: 'white',
        borderBottom: '1px solid #ffcdd2',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'categories', label: 'Categories', icon: '🏷️' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
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
                color: activeTab === tab.id ? '#d32f2f' : '#666',
                borderBottom: activeTab === tab.id ? '2px solid #d32f2f' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main style={{ padding: '2rem', width: '100%', margin: 0 }}>
        {activeTab === 'overview' && (
          <AdminStats stats={stats} />
        )}

        {activeTab === 'users' && (
          <UserManagement users={users} onUpdate={loadAdminData} />
        )}

        {activeTab === 'categories' && (
          <CategoryManagement categories={categories} onUpdate={loadAdminData} />
        )}

        {activeTab === 'settings' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#b71c1c', marginBottom: '2rem' }}>System Settings</h2>
            <p style={{ color: '#666' }}>Settings panel coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

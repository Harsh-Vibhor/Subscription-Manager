import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import AdminLoginModal from './AdminLoginModal';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { user, admin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    } else if (admin) {
      navigate('/admin');
    }
  }, [user, admin, navigate]);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            Subscription Manager
          </div>
          <div className="nav-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowRegister(true)}
            >
              Sign Up
            </button>
            <button
              className="btn btn-admin"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Manage All Your Subscriptions</h1>
          <p>
            Track, organize, and never miss a renewal date again.
            Get insights into your spending and take control of your recurring subscriptions.
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn-primary"
              onClick={() => setShowRegister(true)}
              style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
            >
              Get Started Free
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowLogin(true)}
              style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.1)', width: '100%' }}>
        <div style={{ padding: '0 2rem', maxWidth: '100%', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '2rem' }}>Why Choose Subscription Manager?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3>📅 Never Miss a Renewal</h3>
            <p>Get email and SMS reminders before your subscriptions renew</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3>📊 Spending Analytics</h3>
            <p>Understand your subscription spending with detailed analytics</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3>🏷️ Smart Categories</h3>
            <p>Organize subscriptions by Movies, Networking, K-Drama, and more</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3>🔗 Quick Access</h3>
            <p>Direct links to manage or cancel your subscriptions easily</p>
          </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      {showAdminLogin && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;

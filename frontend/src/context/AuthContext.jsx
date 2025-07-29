import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults and check for existing auth
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');

      console.log('AuthContext: Checking auth on load - token:', !!token, 'adminToken:', !!adminToken);

      if (token) {
        console.log('AuthContext: Found user token, setting up user auth');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('AuthContext: User data from localStorage:', userData);
        if (userData.id) {
          setUser(userData);
        }
      }

      if (adminToken) {
        console.log('AuthContext: Found admin token, setting up admin auth');
        axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
        console.log('AuthContext: Admin data from localStorage:', adminData);
        if (adminData.id) {
          setAdmin(adminData);
        }
      }

      console.log('AuthContext: Auth check complete');
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Making login request to /api/auth/login');
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('AuthContext: Login response received:', response.data);

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      console.log('AuthContext: User state updated, login successful');
      return { success: true, user };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      console.log('AuthContext: Making registration request to /api/auth/register');
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName
      });
      console.log('AuthContext: Registration response received:', response.data);

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      console.log('AuthContext: User state updated, registration successful');
      return { success: true, user };
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      console.log('AuthContext: Making admin login request to /api/auth/admin/login');
      const response = await axios.post('/api/auth/admin/login', { email, password });
      console.log('AuthContext: Admin login response received:', response.data);

      const { token, admin } = response.data;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(admin);

      console.log('AuthContext: Admin state updated, admin login successful');
      return { success: true, admin };
    } catch (error) {
      console.error('AuthContext: Admin login error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Admin login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminData');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setAdmin(null);
  };

  const value = {
    user,
    admin,
    loading,
    login,
    register,
    adminLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, firstName, lastName) => 
    api.post('/auth/register', { email, password, firstName, lastName }),
  adminLogin: (email, password) => api.post('/auth/admin/login', { email, password }),
};

// Subscriptions API
export const subscriptionsAPI = {
  getAll: () => api.get('/subscriptions'),
  getById: (id) => api.get(`/subscriptions/${id}`),
  create: (subscription) => api.post('/subscriptions', subscription),
  update: (id, subscription) => api.put(`/subscriptions/${id}`, subscription),
  delete: (id) => api.delete(`/subscriptions/${id}`),
  getAnalytics: () => api.get('/subscriptions/analytics/summary'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  create: (notification) => api.post('/notifications', notification),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (category) => api.post('/admin/categories', category),
  updateCategory: (id, category) => api.put(`/admin/categories/${id}`, category),
  toggleCategoryStatus: (id) => api.put(`/admin/categories/${id}/toggle-status`),
};

export default api;

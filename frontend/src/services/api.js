import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getDevelopers: () => api.get('/auth/developers'),
  getUsers: () => api.get('/auth/users'),
};

// Project API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  assignDevelopers: (id, developers) => api.post(`/projects/${id}/assign`, { developers }),
  addPhase: (projectId, data) => api.post(`/projects/${projectId}/phases`, data),
};

// Phase API
export const phaseAPI = {
  getById: (id) => api.get(`/phases/${id}`),
  update: (id, data) => api.put(`/phases/${id}`, data),
  delete: (id) => api.delete(`/phases/${id}`),
  addComment: (id, text) => api.post(`/phases/${id}/comments`, { text }),
  getComments: (id) => api.get(`/phases/${id}/comments`),
};

// AI API
export const aiAPI = {
  getMyPerformance: () => api.get('/ai/summary/me'),
  getDeveloperSummary: (developerId) => api.get(`/ai/summary/developer/${developerId}`),
  getProjectSummary: (projectId) => api.get(`/ai/summary/project/${projectId}`),
};

export default api;

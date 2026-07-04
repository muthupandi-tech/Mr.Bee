import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Request Interceptor to add JWT and college context
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mr_bee_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const userStr = localStorage.getItem('mr_bee_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.collegeId) {
            config.headers['x-college-id'] = user.collegeId;
          }
        } catch (e) {
          console.error('Error parsing user storage', e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

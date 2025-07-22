import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Set up axios interceptors to automatically include auth token
export const setupAxiosInterceptors = () => {
  // Request interceptor to add auth token
  axios.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().user?.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Call this function when the app starts
setupAxiosInterceptors();
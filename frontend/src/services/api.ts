import axios from 'axios';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

const API_BASE_URL = 'http://localhost:20005/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API functions
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (user: CreateUserRequest) => api.post<User>('/users', user),
  update: (id: string, user: UpdateUserRequest) =>
    api.put<User>(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Add request interceptor for potential auth tokens
api.interceptors.request.use((config) => {
  // Add auth token here when authentication is implemented
  // const token = localStorage.getItem('authToken');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

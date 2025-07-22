import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:20005';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      // Token expired or invalid, logout user
      useAuthStore.getState().logout();
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async fetch(url: string, options: RequestOptions = {}) {
    const { skipAuth, headers, ...restOptions } = options;

    const requestHeaders = skipAuth
      ? { 'Content-Type': 'application/json', ...headers }
      : { ...this.getAuthHeaders(), ...headers };

    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        ...restOptions,
        headers: requestHeaders,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(url: string, options?: RequestOptions) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: unknown, options?: RequestOptions) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: unknown, options?: RequestOptions) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, options?: RequestOptions) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

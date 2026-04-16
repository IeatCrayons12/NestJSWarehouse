import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  me: () => api.get('/auth/me'),
  googleLoginUrl: () => `${API_URL}/auth/google`,
};

export const itemsApi = {
  list: () => api.get('/items'),
  get: (id: string) => api.get(`/items/${id}`),
  create: (data: unknown) => api.post('/items', data),
  update: (id: string, data: unknown) => api.patch(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
};

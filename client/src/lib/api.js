import axios from 'axios';
import { useAuthStore } from '../store/auth.store.js';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original.__retry && !original.url.includes('/auth/')) {
      original.__retry = true;
      try {
        refreshing =
          refreshing ||
          api.post('/auth/refresh').then((r) => {
            useAuthStore.getState().setAuth(r.data.accessToken, r.data.user);
            return r.data.accessToken;
          });
        const newToken = await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        refreshing = null;
        useAuthStore.getState().logout();
        throw err;
      }
    }
    return Promise.reject(error);
  }
);

export const extractError = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

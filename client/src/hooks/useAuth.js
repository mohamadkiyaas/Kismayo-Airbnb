import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { api } from '../lib/api.js';

export const useAuth = () => {
  const { accessToken, user, setAuth, setUser, logout } = useAuthStore();

  return {
    accessToken,
    user,
    isAuthenticated: !!accessToken && !!user,
    isHost: user?.role === 'host' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    login: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      setAuth(data.accessToken, data.user);
      return data;
    },
    register: async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      setAuth(data.accessToken, data.user);
      return data;
    },
    logout: async () => {
      try {
        await api.post('/auth/logout');
      } catch {
        /* ignore */
      }
      logout();
    },
    refreshMe: async () => {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      return data.user;
    },
  };
};

export const useRequireAuth = (role) => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  useEffect(() => {
    if (!accessToken || !user) {
      navigate(`/login?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (role && user.role !== role && user.role !== 'admin') {
      navigate('/');
    }
  }, [accessToken, user, role, navigate]);
  return { user };
};

import api from './axios';
import type { AuthResponse, LoginRequest, SignUpRequest } from './types';

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    if (res.data?.access_token) {
      localStorage.setItem('token', res.data.access_token);
    }
    return res.data;
  },

  signUp: async (data: SignUpRequest) => {
    const res = await api.post<AuthResponse>('/auth/signUp', data);
    if (res.data?.access_token) {
      localStorage.setItem('token', res.data.access_token);
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};



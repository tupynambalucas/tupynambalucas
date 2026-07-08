import { api } from '@/lib/axios';
import type { LoginDTO, RegisterDTO, LoginResponse } from '@tupynambalucas-hub/core';

export const authApi = {
  login: async (data: LoginDTO) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDTO) => {
    const response = await api.post<{ message: string }>('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  verify: async () => {
    const response = await api.get<LoginResponse>('/auth/verify');
    return response.data;
  },
};

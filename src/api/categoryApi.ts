import api from './axios';
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from './types';

export const categoryApi = {
  getMyCategories: async () => {
    const res = await api.get<{ count?: number; category?: Category[]; Message?: string }>('/category');
    // Backend returns { count, category } or { Message } if no categories
    if (res.data.Message) {
      return [];
    }
    return Array.isArray(res.data.category) ? res.data.category : [];
  },

  getById: async (id: string) => {
    const res = await api.get<Category>(`/category/${id}`);
    return res.data;
  },

  create: async (data: CategoryCreateRequest) => {
    const res = await api.post<Category>('/category', data);
    return res.data;
  },

  update: async (id: string, data: CategoryUpdateRequest) => {
    const res = await api.put<Category>(`/category/${id}`, data);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete<{ Message?: string; Data?: Category }>(
      `/category/${id}`,
    );
    return res.data;
  },
};



import api from "./axios";
import type { Task, TaskCreateRequest, TaskUpdateRequest } from "./types";

export const taskApi = {
  getByCategory: async (categoryId: string) => {
    const res = await api.get<Task[]>(`/task/category/${categoryId}`);
    return res.data;
  },

  getById: async (taskId: string) => {
    const res = await api.get<Task>(`/task/${taskId}`);
    return res.data;
  },

  create: async (categoryId: string, data: TaskCreateRequest) => {
    const res = await api.post<Task>(`/task/category/${categoryId}`, data);
    return res.data;
  },

  update: async (taskId: string, data: TaskUpdateRequest) => {
    const res = await api.put<Task>(`/task/${taskId}`, data);
    return res.data;
  },

  remove: async (taskId: string) => {
    const res = await api.delete<{ Message?: string; Data?: Task }>(
      `/task/${taskId}`
    );
    return res.data;
  },
};

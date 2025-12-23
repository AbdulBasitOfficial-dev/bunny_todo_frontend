import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://nest-todo-app-backend.vercel.app";
// "http://localhost:3000"

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

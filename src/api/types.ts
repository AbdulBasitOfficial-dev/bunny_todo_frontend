export type UserRole = 'user' | 'admin';

export interface AuthResponse {
  access_token: string;
  user?: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface Category {
  _id: string;
  name: string;
  discription?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreateRequest {
  name: string;
  discription?: string;
}

export interface CategoryUpdateRequest {
  name: string;
  discription?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  isCompleted: boolean;
  userId: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  isCompleted?: boolean;
}



import { apiFetch } from '../api/client';
import type { User } from '../types';

export const UserService = {
  getAll: () => apiFetch<User[]>('/users'),
  getById: (id: number) => apiFetch<User>(`/users/${id}`),
};

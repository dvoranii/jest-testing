import { apiFetch } from './apiClient';
import type { Task, NewTask } from '../types/taskTypes';

export const getTasks = async (): Promise<Task[]> => {
  return apiFetch<Task[]>('/tasks');
};

export const addTask = async (task: NewTask): Promise<Task> => {
  return apiFetch<Task>('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
};

export const toggleTask = async (id: number): Promise<Task> => {
  return apiFetch<Task>(`/tasks/${id}/toggle`, { method: 'PATCH' });
};
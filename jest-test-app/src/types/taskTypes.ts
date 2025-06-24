export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export type NewTask = Omit<Task, 'id'>;
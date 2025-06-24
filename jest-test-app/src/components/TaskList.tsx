// src/components/TaskList.tsx
import { TaskItem } from './TaskItem';
import type { Task } from '../types/taskTypes';

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: number) => Promise<void>;
};

export const TaskList = ({ tasks, onToggleTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggle={() => onToggleTask(task.id)} 
        />
      ))}
    </ul>
  );
};
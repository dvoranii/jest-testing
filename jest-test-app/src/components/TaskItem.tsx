import type { Task } from '../types/taskTypes';

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
};

export const TaskItem = ({ task, onToggle }: TaskItemProps) => {
  return (
    <li className="flex items-center p-2 border rounded bg-white">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="h-5 w-5 mr-3"
      />
      <span className={task.completed ? 'line-through text-gray-500' : ''}>
        {task.title}
      </span>
    </li>
  );
};
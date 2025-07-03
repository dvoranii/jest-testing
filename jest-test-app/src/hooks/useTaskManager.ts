import { useState, useEffect } from 'react';
import { getTasks, addTask, toggleTask } from '../services/taskService';
import type { Task } from '../types/taskTypes';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (title: string) => {
    try {
      const newTask = await addTask({ title, completed: false });
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const updatedTask = await toggleTask(id);
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask: handleAddTask,
    toggleTask: handleToggleTask,
  };
};
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTaskManager } from '../../src/hooks/useTaskManager';
import * as taskService from '../../src/services/taskService';

jest.mock('../../src/services/taskService');

describe('useTaskManager', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
  });

  test('loads tasks on mount', async () => {
    const { result } = renderHook(() => useTaskManager());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toEqual(mockTasks);
    });
  });

  test('handles task addition', async () => {
    const newTask = { id: 3, title: 'New Task', completed: false };
    (taskService.addTask as jest.Mock).mockResolvedValue(newTask);
    
    const { result } = renderHook(() => useTaskManager());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
    });

    // Wrap state updates in act()
    await act(async () => {
      await result.current.addTask('New Task');
    });

    // Verify the state update
    expect(result.current.tasks).toHaveLength(3);
    expect(result.current.tasks[2]).toEqual(newTask);
    expect(taskService.addTask).toHaveBeenCalledWith({
      title: 'New Task',
      completed: false
    });
  });

  test('handles errors when adding task', async () => {
    (taskService.addTask as jest.Mock).mockRejectedValue(new Error('Failed'));
    
    const { result } = renderHook(() => useTaskManager());

    await act(async () => {
      await result.current.addTask('New Task');
    });

    expect(result.current.error).toBe('Failed to add task');
    expect(result.current.tasks).toHaveLength(2); // Should remain unchanged
  });
});
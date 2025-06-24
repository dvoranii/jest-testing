
import { getTasks, addTask } from '../../src/services/taskService';
import { apiFetch } from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient', () => ({
  apiFetch: jest.fn(),
}));

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTasks returns tasks', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
    ];

    (apiFetch as jest.Mock).mockResolvedValue(mockTasks);

    const tasks = await getTasks();
    expect(tasks).toEqual(mockTasks);
    expect(apiFetch).toHaveBeenCalledWith('/tasks');
  });

  test('addTask creates new task', async () => {
    const newTask = { title: 'New Task', completed: false };
    const createdTask = { ...newTask, id: 3 };

    (apiFetch as jest.Mock).mockResolvedValue(createdTask);

    const result = await addTask(newTask);
    expect(result).toEqual(createdTask);
    expect(apiFetch).toHaveBeenCalledWith('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
  });
});
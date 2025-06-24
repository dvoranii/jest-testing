// tests/services/taskService.test.ts
import { getTasks, addTask } from '../../src/services/taskService';
import { apiFetch } from '../../src/services/apiClient'; // Import apiFetch directly

// Mock the entire apiClient module using ES module syntax
// This must be done at the top level of the file
jest.mock('../../src/services/apiClient', () => ({
  // We explicitly name what we want to mock from the module
  apiFetch: jest.fn(),
}));

describe('taskService', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('getTasks returns tasks', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
    ];

    // Access the mocked function directly via the imported name
    (apiFetch as jest.Mock).mockResolvedValue(mockTasks);

    const tasks = await getTasks();
    expect(tasks).toEqual(mockTasks);
    // Access the mocked function directly via the imported name
    expect(apiFetch).toHaveBeenCalledWith('/tasks');
  });

  test('addTask creates new task', async () => {
    const newTask = { title: 'New Task', completed: false };
    const createdTask = { ...newTask, id: 3 };

    // Access the mocked function directly via the imported name
    (apiFetch as jest.Mock).mockResolvedValue(createdTask);

    const result = await addTask(newTask);
    expect(result).toEqual(createdTask);
    // Access the mocked function directly via the imported name
    expect(apiFetch).toHaveBeenCalledWith('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
  });
});
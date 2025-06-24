import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../src/components/TaskList';
import type { Task } from '../../src/types/taskTypes';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
  ];

  const mockOnToggleTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays tasks', () => {
    render(<TaskList tasks={mockTasks} onToggleTask={mockOnToggleTask} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('displays empty state when no tasks', () => {
    render(<TaskList tasks={[]} onToggleTask={mockOnToggleTask} />);
    
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument();
  });

  test('calls onToggleTask when task is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onToggleTask={mockOnToggleTask} />);
    
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);
    
    expect(mockOnToggleTask).toHaveBeenCalledWith(1);
    expect(mockOnToggleTask).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleTask with correct task id', async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onToggleTask={mockOnToggleTask} />);
    
    const secondCheckbox = screen.getAllByRole('checkbox')[1];
    await user.click(secondCheckbox);
    
    expect(mockOnToggleTask).toHaveBeenCalledWith(2);
  });

  test('displays correct task completion status', () => {
    render(<TaskList tasks={mockTasks} onToggleTask={mockOnToggleTask} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked(); 
    expect(checkboxes[1]).toBeChecked(); 
  });
});
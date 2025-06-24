import { render, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { TaskItem } from '../../src/components/TaskItem';
import { Task } from '../../src/types/taskTypes';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    completed: false,
  };

  const mockToggle = jest.fn();

  test('renders task title', () => {
    render(<TaskItem task={mockTask} onToggle={mockToggle} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('toggles task status when clicked', async () => {
    render(<TaskItem task={mockTask} onToggle={mockToggle} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  test('shows completed task with line-through', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} onToggle={mockToggle} />);
    const text = screen.getByText('Test Task');
    expect(text).toHaveClass('line-through');
  });
});
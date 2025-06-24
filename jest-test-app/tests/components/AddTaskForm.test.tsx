import { render, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { AddTaskForm } from '../../src/components/AddTaskForm';

describe('AddTaskForm', () => {
  it('calls onAddTask with input value when submitted', async () => {
    const mockAddTask = jest.fn();
    render(<AddTaskForm onAddTask={mockAddTask} />);
    
    const input = screen.getByPlaceholderText('New task...');
    const button = screen.getByText('Add');

    await userEvent.type(input, 'New Task');
    await userEvent.click(button);

    expect(mockAddTask).toHaveBeenCalledWith('New Task');
  });

  it('does not call onAddTask with empty input', async () => {
    const mockAddTask = jest.fn();
    render(<AddTaskForm onAddTask={mockAddTask} />);
    
    const button = screen.getByText('Add');
    await userEvent.click(button);

    expect(mockAddTask).not.toHaveBeenCalled();
  });
});
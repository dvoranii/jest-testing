// tests/components/APIStatus.test.tsx
import { render, screen, waitFor } from '../test-utils';
import { APIStatus } from '../../src/components/APIStatus';
// import * as taskService from '../../src/services/taskService';
import { checkAPIHealth } from '@/services/apiClient';
import userEvent from '@testing-library/user-event';

jest.mock('../../src/services/apiClient', () => ({ // <-- MOCK apiClient instead
  checkAPIHealth: jest.fn(), // Mock this specific function
}));

const mockCheckAPIHealth = checkAPIHealth as jest.Mock;

describe('APIStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows online status when API succeeds', async () => {
    mockCheckAPIHealth.mockResolvedValue(true); // Mock checkAPIHealth directly
    render(<APIStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('api-status')).toHaveTextContent('API Status:');
      expect(screen.getByTestId('api-status-text')).toHaveTextContent('Connected'); // Adjusted text
      expect(screen.getByTestId('api-status-text')).toHaveClass('text-green-800'); // Adjusted class
    });
  });

  it('shows error status when API fails', async () => {
    mockCheckAPIHealth.mockResolvedValue(false); // checkAPIHealth returns false for disconnect
    // Or if it throws: mockCheckAPIHealth.mockRejectedValue(new Error('API down'));
    // But your component handles `false` for disconnected state, so resolved `false` is better.
    render(<APIStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('api-status')).toHaveTextContent('API Status:');
      expect(screen.getByTestId('api-status-text')).toHaveTextContent('Disconnected'); // Adjusted text
      expect(screen.getByTestId('api-status-text')).toHaveClass('text-red-800'); // Adjusted class
    });
  });

  it('shows loading state initially', () => {
    // Delay the mock response to test loading state
    mockCheckAPIHealth.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<APIStatus />);

    // Immediately check for loading state
    expect(screen.getByTestId('api-status')).toHaveTextContent('API Status:');
    expect(screen.getByTestId('api-status-text')).toHaveTextContent('Checking...'); // Adjusted text
    expect(screen.getByTestId('api-status-text')).toHaveClass('text-yellow-800'); // Adjusted class
  });

    it('refreshes status when refresh button is clicked', async () => {
    // Initial state: connected
    mockCheckAPIHealth.mockResolvedValueOnce(true);
    render(<APIStatus />);
    await waitFor(() => expect(screen.getByTestId('api-status-text')).toHaveTextContent('Connected'));

    // Mock next call to be disconnected
    mockCheckAPIHealth.mockResolvedValueOnce(false);

    const refreshButton = screen.getByRole('button', { name: /refresh/i }); // Or "Checking..." if in loading state
    // If the button text can be "Checking..." while loading, consider using its role and disabled state
    // await userEvent.click(screen.getByRole('button', { name: /Refresh/i })); // Assuming button is 'Refresh' when not checking

    // For the initial loading state (before first resolve) the button is 'Checking...' and disabled.
    // After it connects, it becomes 'Refresh' and enabled.
    // If the component is mocked to be connected initially, the button will be 'Refresh'.
    // If it's mocked to be disconnected, it will also be 'Refresh'.
    // Only if it's currently checking, it will be 'Checking...' and disabled.
    await userEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockCheckAPIHealth).toHaveBeenCalledTimes(2); // Initial call + refresh call
      expect(screen.getByTestId('api-status-text')).toHaveTextContent('Disconnected');
    });
  });
});
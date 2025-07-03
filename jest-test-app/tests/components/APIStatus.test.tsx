import { render, screen, waitFor } from '../test-utils';
import { APIStatus } from '../../src/components/APIStatus';
import { checkAPIHealth } from '@/services/apiClient';
import userEvent from '@testing-library/user-event';

jest.mock('../../src/services/apiClient', () => ({
  checkAPIHealth: jest.fn(), 
}));

const mockCheckAPIHealth = checkAPIHealth as jest.Mock;

describe('APIStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows online status when API succeeds', async () => {
    mockCheckAPIHealth.mockResolvedValue(true);
    render(<APIStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('api-status')).toHaveTextContent('API Status:');
      expect(screen.getByTestId('api-status-text')).toHaveTextContent('Connected');
      expect(screen.getByTestId('api-status-text')).toHaveClass('text-green-800'); 
    });
  });

  it('shows error status when API fails', async () => {
    mockCheckAPIHealth.mockResolvedValue(false); 
    render(<APIStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('api-status')).toHaveTextContent('API Status:');
      expect(screen.getByTestId('api-status-text')).toHaveTextContent('Disconnected'); 
      expect(screen.getByTestId('api-status-text')).toHaveClass('text-red-800'); 
    });
  });

  it('shows loading state initially', () => {
    mockCheckAPIHealth.mockImplementation(
      () => new Promise(() => {}) 
    );

    render(<APIStatus />);

    expect(screen.getByTestId('api-status')).toHaveTextContent('API Status:');
    expect(screen.getByTestId('api-status-text')).toHaveTextContent('Checking...'); 
    expect(screen.getByTestId('api-status-text')).toHaveClass('text-yellow-800'); 
  });

    it('refreshes status when refresh button is clicked', async () => {
    mockCheckAPIHealth.mockResolvedValueOnce(true);
    render(<APIStatus />);
    await waitFor(() => expect(screen.getByTestId('api-status-text')).toHaveTextContent('Connected'));

    mockCheckAPIHealth.mockResolvedValueOnce(false);

    const refreshButton = screen.getByRole('button', { name: /refresh/i }); 
    await userEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockCheckAPIHealth).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('api-status-text')).toHaveTextContent('Disconnected');
    });
  });
});
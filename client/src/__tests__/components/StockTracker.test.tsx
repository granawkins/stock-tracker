import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StockTracker from '../../components/StockTracker';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('StockTracker Component', () => {
  // Setup mock data
  const mockStockData = {
    'Meta Data': {
      '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
      '2. Symbol': 'AAPL',
      '3. Last Refreshed': '2023-03-23',
      '4. Output Size': 'Compact',
      '5. Time Zone': 'US/Eastern'
    },
    'Time Series (Daily)': {
      '2023-03-23': {
        '1. open': '158.83',
        '2. high': '160.09',
        '3. low': '157.68',
        '4. close': '158.93',
        '5. volume': '60051404'
      },
      '2023-03-22': {
        '1. open': '159.30',
        '2. high': '162.14',
        '3. low': '157.81',
        '4. close': '157.83',
        '5. volume': '76550686'
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    mockedAxios.get.mockResolvedValue({ data: mockStockData });
  });

  it('renders the search form correctly', () => {
    render(<StockTracker />);
    expect(screen.getByPlaceholderText(/Enter stock ticker/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('handles search and displays stock data', async () => {
    render(<StockTracker />);
    
    // Fill in and submit the search form
    const input = screen.getByPlaceholderText(/Enter stock ticker/i);
    fireEvent.change(input, { target: { value: 'AAPL' } });
    fireEvent.submit(input);
    
    // Check that axios was called with the right URL
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/stock/AAPL');
    });
    
    // Check that stock info is displayed
    await waitFor(() => {
      expect(screen.getByText(/AAPL Stock Price/i)).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    // Mock a failure
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<StockTracker />);
    
    // Fill in and submit the search form
    const input = screen.getByPlaceholderText(/Enter stock ticker/i);
    fireEvent.change(input, { target: { value: 'AAPL' } });
    fireEvent.submit(input);
    
    // Check that error is displayed
    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });
});

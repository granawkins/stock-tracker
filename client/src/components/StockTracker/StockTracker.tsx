import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StockTracker.css';

interface StockData {
  date: string;
  value: number;
}

// Interface for Alpha Vantage daily time series data point
interface AlphaVantageDataPoint {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

// Interface for Alpha Vantage API response structure
interface AlphaVantageResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': Record<string, AlphaVantageDataPoint>;
}

const StockTracker = () => {
  const [ticker, setTicker] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stock data when ticker changes
  useEffect(() => {
    const fetchStockData = async () => {
      if (!ticker) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get<AlphaVantageResponse>(`/api/stock/${ticker}`);
        const timeSeriesData = response.data['Time Series (Daily)'];
        
        if (!timeSeriesData) {
          throw new Error('No data returned from API');
        }
        
        // Format the data for the chart
        const formattedData: StockData[] = Object.entries(timeSeriesData)
          .map(([date, values]: [string, AlphaVantageDataPoint]) => ({
            date,
            value: parseFloat(values['4. close']),
          }))
          .reverse(); // Reverse to show oldest to newest
        
        setStockData(formattedData);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTicker(searchInput.trim().toUpperCase());
    }
  };

  return (
    <div className="stock-tracker">
      <h2>Stock Price Tracker</h2>
      
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter stock ticker (e.g., AAPL)"
        />
        <button type="submit">Search</button>
      </form>
      
      {loading && <div className="loading">Loading...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {ticker && !loading && !error && (
        <div className="stock-info">
          <h3>{ticker} Stock Price</h3>
          
          {stockData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={stockData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => {
                      const date = new Date(tick);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-data">No data available for {ticker}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockTracker;

import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// We'll use Alpha Vantage as our stock data provider (free tier)
const ALPHA_VANTAGE_API_KEY = 'demo'; // Using demo key for now, should be replaced with real key

// Endpoint to fetch stock data by ticker symbol
router.get('/stock/:ticker', async (req: Request, res: Response) => {
  try {
    const { ticker } = req.params;
    const function_type = req.query.function || 'TIME_SERIES_DAILY'; // Default to daily time series
    const outputsize = req.query.outputsize || 'compact'; // Default to compact (last 100 data points)
    
    // Make request to Alpha Vantage API
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: function_type,
        symbol: ticker,
        apikey: ALPHA_VANTAGE_API_KEY,
        outputsize: outputsize
      }
    });
    
    // Pass the data through to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ 
      error: 'Error fetching stock data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

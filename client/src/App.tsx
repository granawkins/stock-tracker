import { useState, useEffect } from 'react';
import mentatLogo from '/mentat.png';
import Background from './components/Background';
import StockTracker from './components/StockTracker';

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendMessage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api');

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBackendMessage();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f0f0f0',
        padding: '20px',
      }}
    >
      <Background />
      <div>
        <a href="https://mentat.ai" target="_blank">
          <img src={mentatLogo} className="logo" alt="Mentat logo" width="100" />
        </a>
      </div>
      <h1>Stock Tracker</h1>
      
      <StockTracker />
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p>
          <b>API Status:</b>{' '}
          {loading
            ? 'Connecting to server...'
            : error
              ? `Error: ${error}`
              : message
                ? message
                : 'No connection to server'}
        </p>
      </div>
    </div>
  );
}

export default App;
